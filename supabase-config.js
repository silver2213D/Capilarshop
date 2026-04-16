// CONFIGURACIÓN DE SUPABASE
const SUPABASE_URL = 'https://vzvbeblwmmblnnbpdzqx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6dmJlYmx3bW1ibG5uYnBkenF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxMjIyMTMsImV4cCI6MjA4OTY5ODIxM30.XMXAa_w7Tqste1E4PBanyvfSBCCGuIorrhHw0RpCjtI';

// Inicializar cliente de Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

// Log de conexión con detalles
console.log('=== SUPABASE CONFIGURATION ===');
console.log('URL:', SUPABASE_URL);
console.log('Cliente inicializado:', supabaseClient ? 'SÍ ✓' : 'NO ✗');

// Test de conexión
setTimeout(async () => {
    try {
        const { data, error } = await supabaseClient
            .from('productos')
            .select('*')
            .limit(1);
        
        if (error) {
            console.error('❌ ERROR Conectando a Supabase:', error);
            console.error('Detalles:', error.message);
        } else {
            console.log('✓ Conexión a Supabase OK');
            console.log('Tabla "productos" accesible');
        }
    } catch (err) {
        console.error('❌ EXCEPCIÓN:', err);
    }
}, 1000);

// Cambio mínimo para commit
