import { query } from './db.jsx';

export async function autorizacion(Astro, options = {}) {
  const { nuevapagina = '/404' } = options;
  const sid = Astro.cookies.get('sid')?.value;

  if (!sid) {
    return Astro.redirect(nuevapagina);
  }

  const sesion = await query(
    'SELECT id_sesion, id_usuario, nombre_usuario FROM sesion WHERE id_sesion = $1 AND anulada = false AND fecha_expiracion >= CURRENT_DATE LIMIT 1',
    [sid]
  );

  //pendiente comprobar rol usuario

  if (!sesion.rowCount) {
    return Astro.redirect(nuevapagina);
  }

  return null;
}
