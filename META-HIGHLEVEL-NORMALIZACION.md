# Normalización Meta + HighLevel

Este documento convierte la conversación compartida en un procedimiento verificable. No acredita que una conexión ya esté activa.

## Identidad pública canónica

- Marca: `UROCLINIC Institute`
- Profesional: `Dr. Jovani Torres`
- Posicionamiento: `Urología Integral, Precisa y Confidencial.`
- Ubicación: Torreón, Coahuila; cobertura local de Comarca Lagunera.
- Facebook candidato: `https://www.facebook.com/uroclinicdrjovanii`
- Instagram candidato: `@uroclinicdrjovanii`

Los identificadores de Meta son candidatos hasta confirmarlos dentro de la subcuenta correcta de HighLevel. No añadirlos a `sameAs`, al pie de página ni a campañas antes de esa verificación.

## Puerta de verificación

Si no está visible la subcuenta o Location ID de producción, detener el proceso con:

`BLOCKED — LOCATION CONTEXT REQUIRED`

Dentro de HighLevel → Settings e Integrations, registrar evidencia de:

1. Facebook Page ID y nombre.
2. Instagram Business Account ID y usuario.
3. Relación Facebook ↔ Instagram.
4. Permisos de publicación, mensajería y Lead Forms.
5. Estado de Social Planner.

Usar tres estados separados: `CONNECTED`, `TESTED`, `PUBLISHED`. No marcar un estado sin evidencia. No desconectar, borrar o fusionar activos durante la auditoría.

## CRM canónico

Reutilizar el pipeline `UROCLINIC — Captación y Conversión`; no crear duplicados. Etapas:

1. Lead nuevo
2. Contacto pendiente
3. Contactado
4. Valoración solicitada
5. Cita agendada
6. Cita confirmada
7. Asistió
8. Seguimiento
9. Tratamiento/procedimiento interesado
10. Conversión
11. No convertido
12. Reactivación

Reglas de datos:

- Antes de crear un contacto, buscarlo o usar `upsert`.
- Antes de crear una oportunidad, buscar una oportunidad abierta equivalente.
- Conservar la fuente de primer contacto y registrar UTM por separado.
- Mantener Google Business, Doctoralia, Meta y web como fuentes distintas.
- Conversation AI responde únicamente asuntos administrativos; no diagnostica, interpreta estudios ni recomienda tratamientos.
- El flujo académico UROCLINIC GRINKER debe mantenerse separado del CRM de pacientes.

## Política de comunicación

- No publicar tratamientos regenerativos como oferta comercial.
- Salud sexual: comunicar evaluación integral y confidencial, sin promocionar dispositivos o terapias específicas.
- Usar prueba auténtica, baja fricción, microcompromisos y explicación anticipada del proceso.
- Evitar miedo extremo, vergüenza, humillación, amenazas, falsa urgencia o promesas de resultado.
- Precio, inclusiones y promociones requieren aprobación antes de publicarse. La consulta autorizada para esta versión es de `$1,000 MXN`.

## Prueba de aceptación

- [ ] El contacto de prueba se actualiza sin duplicarse.
- [ ] Solo existe una oportunidad abierta equivalente.
- [ ] Fuente y UTM permanecen diferenciadas.
- [ ] El workflow llega a `Lead nuevo`.
- [ ] Mensaje administrativo no incluye datos clínicos.
- [ ] Publicación de prueba en Meta se revisa antes de publicar.
- [ ] Respuesta entrante se registra en la conversación correcta.
- [ ] Evidencias incluyen fecha, responsable, Location ID y resultado.
