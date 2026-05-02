/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Activity } from "../types";

console.log("Gemini API service module loaded.");

let aiClient: any = null;

async function getAI() {
  if (aiClient) return aiClient;
  
  // En AI Studio, la clave se mapea preferentemente a process.env.GEMINI_API_KEY
  let apiKey = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "") as string;
  apiKey = apiKey.trim();

  // Limpieza de valores nulos o indefinidos que pueden venir de strings de entorno no configurados
  if (!apiKey || apiKey === 'undefined' || apiKey === 'null' || apiKey === '') {
    // Intento final vía import.meta.env por si acaso
    apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "") as string;
    if (!apiKey || apiKey === 'undefined' || apiKey === 'null' || apiKey === '') {
      console.warn("Gemini API: No se encontró clave de API válida.");
      return null;
    }
  }
  
  try {
    const { GoogleGenAI } = await import("@google/genai");
    // Inicialización siguiendo el patrón de AI Studio: objeto con propiedad apiKey
    aiClient = new GoogleGenAI({ apiKey });
    console.log("Gemini API: Inicializado correctamente.");
    return aiClient;
  } catch (err) {
    console.error("Gemini SDK initialization error:", err);
    return null;
  }
}

export async function isAIConfigured(): Promise<boolean> {
  const ai = await getAI();
  return !!ai;
}

export async function suggestConcrecion(
  stage: string,
  level: string,
  description: string,
  type: 'criterio' | 'saber'
): Promise<string> {
  const ai = await getAI();
  if (!ai) return "IA no configurada. Añada su clave en Settings > VITE_GEMINI_API_KEY.";

  const prompt = `Actúa como un experto en pedagogía de Religión Católica y currículo LOMLOE.
  Necesito concretar contenidos específicos para el aula basados en el siguiente ${type}:
  
  Etapa: ${stage}
  Nivel: ${level}
  Descripción oficial: "${description}"
  
  Propón 2-3 contenidos mínimos, concretos y evaluables que un profesor pueda dar en clase para cumplir con este punto del currículo. 
  Busca que sean contenidos que den estabilidad a la asignatura y aseguren que los alumnos aprenden lo esencial.
  Responde con una lista corta y directa en español.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text ?? "No se pudo generar una sugerencia.";
  } catch (error) {
    console.error("Error generating suggestion:", error);
    return "Error al conectar con la IA.";
  }
}

export async function evaluateLinks(
  criterionDescription: string,
  saberes: { id: string, description: string }[]
): Promise<string[]> {
  const ai = await getAI();
  if (!ai) return [];

  const prompt = `Actúa como un experto en el currículo de Religión Católica.
  Tengo el siguiente Criterio de Evaluación:
  "${criterionDescription}"
  
  Y tengo esta lista de Saberes Básicos disponibles:
  ${saberes.map((s: any, index: number) => `${index + 1}. [ID: ${s.id}] ${s.description}`).join('\n')}
  
  Determina qué Saberes Básicos de la lista son necesarios o están directamente relacionados para alcanzar este Criterio de Evaluación.
  Responde ÚNICAMENTE con los IDs de los saberes seleccionados (ejemplo: sb-1, sb-ESO-2), separados por comas. 
  Si ninguno es relevante, responde con la palabra "NINGUNO".`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    const text = response.text?.trim() || "";
    if (text === "NINGUNO") return [];
    
    return text.split(',').map((id: string) => id.trim()).filter((id: string) => saberes.some((s: any) => s.id === id));
  } catch (error) {
    console.error("Error evaluating links:", error);
    return [];
  }
}

export async function suggestSaberesForCriteria(
  criteriaDescriptions: string[],
  saberes: { id: string, description: string, category: string }[]
): Promise<string[]> {
  const ai = await getAI();
  if (!ai) return [];

  const prompt = `Actúa como un experto en el currículo de Religión Católica.
  He seleccionado estos Criterios de Evaluación para una situación de aprendizaje:
  ${criteriaDescriptions.map((c, i) => `${i + 1}. ${c}`).join('\n')}
  
  Y estos son los Saberes Básicos disponibles:
  ${saberes.map((s, i) => `- [ID: ${s.id}] (${s.category}) ${s.description}`).join('\n')}
  
  Basándote en los Criterios de Evaluación seleccionados, ¿qué Saberes Básicos son los más adecuados para trabajar en esta situación?
  Responde ÚNICAMENTE con una lista de IDs separados por comas. Ejemplo: sb-1, sb-2, sb-3.
  Selecciona solo los que sean realmente necesarios. Si ninguno es relevante, responde "NINGUNO".`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    const text = response.text?.trim() || "";
    if (text === "NINGUNO") return [];
    return text.split(',').map((id: string) => id.trim()).filter((id: string) => id.length > 0);
  } catch (error) {
    console.error("Error suggesting saberes:", error);
    return [];
  }
}

export async function suggestUnitContent(
  curriculum: string,
  materials?: string,
  extraContext?: string
): Promise<string> {
  const ai = await getAI();
  if (!ai) return "IA no configurada. Añada su clave en Settings > VITE_GEMINI_API_KEY.";

  const prompt = `Actúa como un experto pedagogo en Religión Católica.
  Basándote en los siguientes elementos curriculares seleccionados:
  ${curriculum}
  
  ${materials ? `Prioridad Crítica: Integra e inspírate profundamente en estas ideas previas del docente: "${materials}". El contenido propuesto debe aterrizar estas ideas en el currículo oficial.` : ''}
  ${extraContext ? `Contexto adicional (metodología/preferencias): "${extraContext}"` : ''}
  
  Propón un desarrollo de contenidos específicos para esta Situación de Aprendizaje.
  
  ATENCIÓN: Responde ÚNICAMENTE con los contenidos específicos (saberes básicos aterrizados). NO incluyas justificación, NO incluyas producto final, NO incluyas introducción.
  Asegúrate de que la propuesta sea fiel a las ideas iniciales del docente pero con el rigor curricular necesario.
  Responde con el texto propuesto directamente en un formato de lista claro.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text?.trim() || "No se ha podido generar contenido.";
  } catch (error) {
    console.error("Error suggesting content:", error);
    return "Error al generar sugerencia de contenidos.";
  }
}

export async function generateSequencing(
  curriculum: string,
  content: string,
  methodology: string,
  productMode: 'cumulative' | 'compilatory',
  numSessions: number = 5
): Promise<{ activities: Activity[], finalProductTitle: string, finalProductDescription: string, finalProduct: string, justification: string }> {
  const ai = await getAI();
  if (!ai) return { activities: [], finalProductTitle: "", finalProductDescription: "", finalProduct: "IA no configurada. Añada su clave en Settings > VITE_GEMINI_API_KEY.", justification: "" };

  const prompt = `Como experto en diseño instruccional para Religión Católica, crea una propuesta completa para una Situación de Aprendizaje organizada en ${numSessions} sesiones.
  
  CURRÍCULO: ${curriculum}
  CONTENIDOS SELECCIONADOS: ${content}
  METODOLOGÍA: ${methodology}
  MODO PRODUCTO FINAL: ${productMode === 'cumulative' ? 'Acumulativo (suma de las actividades)' : 'Compilatorio (actividad final de síntesis)'}
 
  Necesito que generes:
  1. Una JUSTIFICACIÓN pedagógica breve y motivadora de la situación de aprendizaje.
  2. Un PRODUCTO FINAL atractivo consistente en un TÍTULO motivador y una DESCRIPCIÓN detallada.
  3. Una SECUENCIA de ${numSessions} sesiones (actividades), donde para cada una detalles:
     - Título
     - Categoría (motivación, activación, exploración, estructuración, aplicación o conclusión)
     - Descripción detallada (qué harán los alumnos)
     - Temporalización (ej: 1 sesión de 60 min)
     - Recursos necesarios
     - Criterios de evaluación específicos vinculados a esa actividad (basados en el currículo aportado)
     - Propuesta de ejercicios o tareas concretas dentro de la actividad
     - Metodología específica para esta sesión

  Responde ÚNICAMENTE con un objeto JSON (sin bloques markdown) con este formato:
  {
    "justification": "texto de la justificación",
    "finalProductTitle": "título motivador del producto final",
    "finalProductDescription": "descripción detallada de lo que harán en el producto",
    "finalProduct": "resumen corto del producto",
    "activities": [
      {
        "id": "act-1",
        "title": "título",
        "category": "motivación | activación | exploración | estructuración | aplicación | conclusión",
        "description": "descripción",
        "timing": "tiempo",
        "resources": "recursos",
        "criteria": "criterios de evaluación vinculados (incluye los códigos numéricos ej: 1.1, 2.3)",
        "exercises": "lista de ejercicios o tareas",
        "methodology": "metodología de la sesión"
      }
    ]
  }
  Asegúrate de que los criterios de evaluación de cada actividad sean coherentes con el currículo oficial aportado. IMPORTANTE: En el campo "criteria" de cada actividad, incluye la descripción de los criterios de evaluación precedida por su código (ID). NO incluyas las competencias específicas.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    const text = response.text?.trim() || "{}";
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(jsonStr);
    return {
      activities: data.activities || [],
      finalProductTitle: data.finalProductTitle || data.finalProduct || "",
      finalProductDescription: data.finalProductDescription || data.finalProduct || "",
      finalProduct: data.finalProduct || "",
      justification: data.justification || ""
    };
  } catch (error) {
    console.error("Error generating sequencing:", error);
    return { activities: [], finalProductTitle: "", finalProductDescription: "", finalProduct: "Error al generar secuenciación.", justification: "" };
  }
}

export async function regenerateActivity(
  activityIndex: number,
  curriculum: string,
  content: string,
  methodology: string,
  currentActivities: Activity[]
): Promise<Activity> {
  const ai = await getAI();
  const currentActivity = currentActivities[activityIndex];
  if (!ai) return currentActivity;

  const prompt = `Como experto en diseño instruccional, necesito regenerar la ACTIVIDAD ${activityIndex + 1} de una situación de aprendizaje porque la propuesta actual no nos convence.
  
  CONTEXTO:
  - Currículo: ${curriculum}
  - Contenidos: ${content}
  - Metodología: ${methodology}
  - Otras actividades de la secuencia: ${currentActivities.filter((_, i) => i !== activityIndex).map(a => a.title).join(', ')}
  
  ACTIVIDAD ACTUAL (a mejorar):
  - Título: ${currentActivity.title}
  - Descripción: ${currentActivity.description}
  
  Propón una nueva versión de esta actividad que sea más creativa y motivadora.
  
  Responde ÚNICAMENTE con un objeto JSON (sin bloques markdown) con este formato:
  {
    "id": "${currentActivity.id}",
    "title": "nuevo título",
    "category": "motivación | activación | exploración | estructuración | aplicación | conclusión",
    "description": "nueva descripción detallada",
    "timing": "tiempo",
    "resources": "recursos",
    "criteria": "criterios de evaluación vinculados (incluye los códigos numéricos)",
    "exercises": "nuevos ejercicios o tareas",
    "methodology": "metodología sugerida para la sesión"
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    const text = response.text?.trim() || "{}";
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error regenerating activity:", error);
    return currentActivity;
  }
}

export async function regenerateFinalProduct(
  curriculum: string,
  content: string,
  methodology: string,
  activities: Activity[],
  productMode: string
): Promise<{ title: string, description: string }> {
  const ai = await getAI();
  if (!ai) return { title: "", description: "IA no configurada. Añádela en Settings > VITE_GEMINI_API_KEY." };

  const prompt = `Como experto en diseño instruccional, propón un NUEVO producto final para esta situación de aprendizaje con un título motivador y una descripción detallada.
  
  CONTENIDO: ${content}
  ACTIVIDADES PREVIAS: ${activities.map(a => a.title).join(', ')}
  METODOLOGÍA: ${methodology}
  MODO: ${productMode === 'cumulative' ? 'Acumulativo (suma de las actividades)' : 'Compilatorio (actividad final de síntesis)'}
  
  Responde ÚNICAMENTE con un objeto JSON (sin bloques markdown) con este formato:
  {
    "title": "nuevo título",
    "description": "nueva descripción detallada"
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    const text = response.text?.trim() || "{}";
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(jsonStr);
    return {
      title: data.title || "",
      description: data.description || ""
    };
  } catch (error) {
    console.error("Error regenerating final product:", error);
    return { title: "", description: "Error al regenerar el producto final." };
  }
}

export async function analyzeExistingContent(
  materials: string,
  curriculumContext: {
    competencias: { id: string, description: string, criterios: { id: string, description: string }[] }[],
    saberes: { id: string, description: string }[]
  }
): Promise<{ ceIds: string[], critIds: string[], saberIds: string[] }> {
  const ai = await getAI();
  if (!ai) return { ceIds: [], critIds: [], saberIds: [] };

  const prompt = `Actúa como un experto en el currículo de Religión Católica LOMLOE.
  El usuario dispone de los siguientes materiales o descripción de contenido:
  "${materials}"
  
  Basándote en este contenido, identifica los elementos curriculares más relacionados de la siguiente lista oficial:
  
  COMPETENCIAS Y CRITERIOS:
  ${curriculumContext.competencias.map(ce => `- Competencia [ID: ${ce.id}]: ${ce.description}\n  ${ce.criterios.map(c => `  * Criterio [ID: ${c.id}]: ${c.description}`).join('\n')}`).join('\n')}
  
  SABERES BÁSICOS:
  ${curriculumContext.saberes.map(s => `- Saber [ID: ${s.id}]: ${s.description}`).join('\n')}
  
  Tu tarea es seleccionar los elementos que mejor se ajusten a los materiales. 
  REGLAS CRÍTICAS:
  1. No selecciones una Competencia sin seleccionar al menos uno de sus Criterios.
  2. Si seleccionas un Criterio, debes incluir obligatoriamente el ID de su Competencia asociada.
  3. Enfócate principalmente en los Criterios, ya que son los que definen el nivel específico.
  
  Responde ÚNICAMENTE con un objeto JSON (sin bloques de código markdown) con este formato:
  {
    "ceIds": ["ID_COMPETENCIA1", "ID_COMPETENCIA2"],
    "critIds": ["ID_CRITERIO1", "ID_CRITERIO2"],
    "saberIds": ["ID_SABER1", "ID_SABER2"]
  }
  
  Si algún elemento no tiene relación clara, no lo incluyas en los arrays correspondientes.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    const text = response.text?.trim() || "{}";
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Error analyzing content:", error);
    return { ceIds: [], critIds: [], saberIds: [] };
  }
}
