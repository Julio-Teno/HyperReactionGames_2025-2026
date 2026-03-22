import { query } from '../../../lib/db.jsx';

export const prerender = false;

export async function GET({ cookies }) {
    try {
        const sid = cookies.get('sid')?.value;

        if (!sid) {
            return Response.json({ valid: false }, { status: 200 });
        }

        const consulta = await query(
            'SELECT id_sesion, nombre_usuario FROM sesion WHERE id_sesion = $1 AND anulada = false AND fecha_expiracion >= CURRENT_DATE LIMIT 1',
            [sid]
        );

        return Response.json({ valid: consulta.rowCount > 0, username: consulta.rows[0]?.nombre_usuario }, { status: 200 });
    } catch {
        return Response.json({ valid: false }, { status: 200 });
    }
}