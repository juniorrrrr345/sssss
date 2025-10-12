// Middleware pour gérer les bindings D1 et R2
export async function onRequest(context) {
    // Passer au handler suivant
    return context.next();
}