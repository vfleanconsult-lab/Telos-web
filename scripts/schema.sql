-- Esquema de base de datos para el módulo de Evaluación de Madurez
-- Ejecutar en Supabase SQL Editor: https://supabase.com/dashboard/project/jsvnedimselixowhzmkt/editor

-- Una evaluación por proceso de diagnóstico
CREATE TABLE IF NOT EXISTS evaluaciones (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_empresa TEXT NOT NULL,
  rut_empresa    TEXT NOT NULL,
  fecha_evaluacion DATE NOT NULL,
  rubrica_id     TEXT NOT NULL DEFAULT 'finanzas-madurez-v1',
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- N evaluadores por evaluación
CREATE TABLE IF NOT EXISTS evaluadores (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluacion_id UUID REFERENCES evaluaciones(id) ON DELETE CASCADE,
  nombre        TEXT NOT NULL,
  email         TEXT NOT NULL,
  token         UUID UNIQUE DEFAULT gen_random_uuid(),
  correo_enviado BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Una fila por práctica por evaluador (upsert en auto-save)
CREATE TABLE IF NOT EXISTS respuestas (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluador_id  UUID REFERENCES evaluadores(id) ON DELETE CASCADE,
  evaluacion_id UUID REFERENCES evaluaciones(id) ON DELETE CASCADE,
  codigo        TEXT NOT NULL,
  puntuacion    NUMERIC(3,1) CHECK (puntuacion >= 0 AND puntuacion <= 4),
  comentario    TEXT DEFAULT '',
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(evaluador_id, codigo)
);

-- Nota de consenso acordada en calibración
CREATE TABLE IF NOT EXISTS consenso (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluacion_id          UUID REFERENCES evaluaciones(id) ON DELETE CASCADE,
  codigo                 TEXT NOT NULL,
  nota_consenso          NUMERIC(3,1) CHECK (nota_consenso >= 0 AND nota_consenso <= 4),
  comentario_calibracion TEXT DEFAULT '',
  updated_at             TIMESTAMPTZ DEFAULT now(),
  UNIQUE(evaluacion_id, codigo)
);

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_evaluadores_evaluacion ON evaluadores(evaluacion_id);
CREATE INDEX IF NOT EXISTS idx_respuestas_evaluador   ON respuestas(evaluador_id);
CREATE INDEX IF NOT EXISTS idx_respuestas_evaluacion  ON respuestas(evaluacion_id);
CREATE INDEX IF NOT EXISTS idx_consenso_evaluacion    ON consenso(evaluacion_id);
