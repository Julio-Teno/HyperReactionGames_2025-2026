

/*import { query } from '../../../lib/db';
//plan julio
//primero, recibir datos del formulario

//segundo validar datos y comprobar que el usuario existe

export async function POST(request) {

result = await query('SELECT id_usuario, nombre, password FROM usuario WHERE nombre = ?', [username]);

if (!result.rows) {
    return Response.json({ error: 'Usuario no encontrado' }, { status: 404 });
}

}
//tercero realizar la autenticacion y devolver una cookie de sesion

*/

import { query } from '../../../lib/db.jsx';

import { randomBytes } from 'node:crypto';

export const prerender = false;

export async function POST({ request }) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let usuario = '';
    let password = '';

    if (contentType.includes('application/json')) { //si es json como json
      const body = await request.json();
      usuario = body?.usuario || '';
      password = body?.password || '';
    } else {
      const form = await request.formData(); //si es form-data como form
      usuario = String(form.get('usuario') || '');
      password = String(form.get('password') || '');
    }

    if (!usuario || !password) {
      return Response.json({ error: 'Faltan usuario o password' }, { status: 400 });
    }

    const result = await query(
      'SELECT id_usuario, nombre, password FROM usuario WHERE nombre = $1',
      [usuario]
    );

    if (!result.rowCount) { //no u
      return Response.json({ error: 'Credenciales incorrectas' }, { status: 404 });
    }

    const user = result.rows[0];

    if (user.password !== password) { //no up
      return Response.json({ error: 'Credenciales incorrectas' }, { status: 401 });
    }

    //los datos son correctos, crear cookie
    //para ello crear una id de session num azar
    const idsesion = randomBytes(16).toString('hex'); //hex de 32 caracteres
    const diasesion = 7;
    const diassegundos = diasesion * 24 * 60 * 60;

    const cookieresult = await query(
      'INSERT INTO sesion (id_sesion, id_usuario, nombre_usuario ,fecha_creacion, fecha_expiracion) VALUES ($1, $2, $3, CURRENT_DATE, CURRENT_DATE + $4::int)',
      [idsesion, user.id_usuario, user.nombre, diasesion]
    );

    const lacookie = `sid=${idsesion}; Path=/; Max-Age=${diassegundos}; HttpOnly; SameSite=Lax`;

    return Response.json({ message: 'Inicio de sesión exitoso' }, { status: 200, headers: { 'Set-Cookie': lacookie } });
  } catch (error) {
    return Response.json(
      { error: 'Error interno del servidor', details: String(error?.message || error) },
      { status: 500 }
    );
  }
}