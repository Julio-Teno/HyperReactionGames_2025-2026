import { query } from './db.jsx';

export async function autorizacion(Astro, options = {}) {
  const { nuevapagina = '/404' } = options;
  const {nuevapagina2 = '/denegado'} = options;
  const rolRequerido = options.rolRequerido || null;
  const rolesRequeridos = options.rolesRequeridos || [];
  const sid = Astro.cookies.get('sid')?.value;

  //meter roles en un array
  const roles = rolRequerido !== null ? [rolRequerido] : rolesRequeridos;

  if (!sid) {
    return Astro.redirect(nuevapagina);
  }

  const sesion = await query(
    'SELECT id_sesion, id_usuario, nombre_usuario FROM sesion WHERE id_sesion = $1 AND anulada = false AND fecha_expiracion >= CURRENT_DATE LIMIT 1',
    [sid]
  );

  if (!sesion.rowCount) {
    return Astro.redirect(nuevapagina);
  }

  const idUsuario = sesion.rows[0].id_usuario;

  if (roles.length > 0) {
    const rolPermitido = await query(
      'SELECT id_rol FROM usuariorol WHERE id_usuario = $1 AND id_rol = ANY($2::int[]) LIMIT 1',
      [idUsuario, roles]
    );
    if (!rolPermitido.rowCount) {
      return Astro.redirect(nuevapagina2);
    }
  }
  

  return null;
}

