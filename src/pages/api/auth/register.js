import { query } from '../../../lib/db.jsx';

export const prerender = false; //no prerender porque es una api y no una pagina 

export async function POST({ request }) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let usuario = '';
    let password = '';
    let password2 = '';

    if (contentType.includes('application/json')) { //si es json como json
      const body = await request.json();
      usuario = body?.usuario || '';
      password = body?.password || '';
      password2 = body?.password2 || '';
    } else {
      const form = await request.formData(); //si es form-data como form
      usuario = String(form.get('usuario') || '');
      password = String(form.get('password') || '');
      password2 = String(form.get('password2') || '');
    }

    if (!usuario || !password || !password2) {
      return Response.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    if (password !== password2) {
      return Response.json({ error: 'Las contraseñas no coinciden' }, { status: 400 });
    }

    const selectresult = await query(
      'SELECT id_usuario, nombre FROM usuario WHERE nombre = $1',
      [usuario]
    );

    if (selectresult.rowCount) { //si ya existe un usuario con ese nombre
      return Response.json({ error: 'El nombre de usuario ya está en uso' }, { status: 409 });
    }

    //insert //comentar mejora password
    const insertresult = await query(
      'INSERT INTO usuario (nombre, password, fecha_alta) VALUES ($1, $2, CURRENT_DATE) RETURNING id_usuario',
      [usuario, password]
    );

    if (!insertresult.rowCount) {
      return Response.json({ error: 'Error al registrar el usuario' }, { status: 500 });
    }

    return Response.json({ message: 'Usuario registrado exitosamente' }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: 'Error interno del servidor', details: String(error?.message || error) },
      { status: 500 }
    );
  }
}