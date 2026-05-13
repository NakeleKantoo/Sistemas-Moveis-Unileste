import { SQLiteDatabase } from 'expo-sqlite';

export async function migrate(database:SQLiteDatabase) {
    return database.execAsync(`            
            CREATE TABLE IF NOT EXISTS meta (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                total INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS transacoes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT,
                valor INTEGER NOT NULL,
                meta_id INT NOT NULL,
                FOREIGN KEY (meta_id) REFERENCES meta(id) ON DELETE CASCADE
            );
        `);
}