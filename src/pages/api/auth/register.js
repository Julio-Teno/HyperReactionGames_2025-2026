import { query } from '../../../lib/db.jsx';
import bcrypt from 'bcryptjs';

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

    if (!validarPass(password)) {
      return Response.json(
        { error: 'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos' },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt); 

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
      [usuario, passwordHash]
    );

    if (!insertresult.rowCount) {
      return Response.json({ error: 'Error al registrar el usuario' }, { status: 500 });
    }

    //pendiente dar rol por defecto al usuario
    const rolResult = await query('INSERT INTO usuariorol (id_usuario, id_rol) VALUES ($1, $2)', [insertresult.rows[0].id_usuario, 1]); // Asignar rol de usuario por defecto
    if (!rolResult.rowCount) {
      return Response.json({ error: 'Error al asignar rol al usuario' }, { status: 500 });
    }

    return Response.json({ message: 'Usuario registrado exitosamente' }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: 'Error interno del servidor', details: String(error?.message || error) },
      { status: 500 }
    );
  }

  function validarPass(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/; //al menos: 8 caracteres, una mayúscula, una minúscula, un número y un símbolo
    return regex.test(password);
  }
}