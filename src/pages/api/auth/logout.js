//borrar cookies de sesión
import { query } from '../../../lib/db.jsx';

export const prerender = false;

//coger id de sesion de cookie y anularla
export async function GET({ cookies, redirect }) {
  const sid = cookies.get('sid')?.value;

  if (sid) {
    await query(
      'UPDATE sesion SET fecha_expiracion = CURRENT_DATE, anulada = true WHERE id_sesion = $1',
      [sid]
    );
  }

  cookies.set('sid', '', {
    path: '/',
    maxAge: 0,
    httpOnly: true,
    sameSite: 'lax'
  });

  return redirect('/');
}