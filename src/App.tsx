/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, TextareaHTMLAttributes, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  ChevronRight, 
  ChevronDown,
  Plus, 
  Sparkles, 
  Trash2, 
  Save, 
  Download,
  Copy,
  Check,
  Link,
  School,
  GraduationCap,
  Baby,
  Users,
  Layout,
  FileText,
  ChevronLeft,
  Loader2,
  AlertCircle,
  X,
  Target,
  PenTool,
  Workflow,
  Settings,
  Dna,
  Menu,
  RotateCw,
  Edit2,
  Calendar,
  Wrench,
  Lightbulb,
  Compass,
  BookText,
  LogOut,
  User as UserIcon,
  FileJson,
  ClipboardList,
  Github
} from 'lucide-react';
import { CurriculumBlock, Competencia, SaberBásico, Criterio, Activity, UnitPlan } from './types';
import { DEFAULT_CURRICULUM } from './data/curriculumDefaults';
import { 
  STAGE_LEVELS, 
  COMPETENCIAS_INFANTIL,
  CRITERIOS_INFANTIL_3ANOS,
  CRITERIOS_INFANTIL_4ANOS,
  CRITERIOS_INFANTIL_5ANOS,
  SABERES_INFANTIL,
  COMPETENCIAS_PRIMARIA,
  CRITERIOS_PRIMARIA_1,
  CRITERIOS_PRIMARIA_2,
  CRITERIOS_PRIMARIA_3,
  CRITERIOS_PRIMARIA_4,
  CRITERIOS_PRIMARIA_5,
  CRITERIOS_PRIMARIA_6,
  SABERES_PRIMARIA_1_2,
  SABERES_PRIMARIA_3_4,
  SABERES_PRIMARIA_5_6,
  SABERES_BACHILLERATO,
  COMPETENCIAS_ESO, 
  COMPETENCIAS_BACHILLERATO,
  CRITERIOS_ESO_1, 
  CRITERIOS_ESO_2,
  CRITERIOS_ESO_3,
  CRITERIOS_ESO_4,
  SABERES_ESO_1_2,
  SABERES_ESO_3_4
} from './data/curriculumOfficial';
import { 
  suggestConcrecion, 
  evaluateLinks, 
  analyzeExistingContent,
  suggestUnitContent,
  generateSequencing,
  suggestSaberesForCriteria,
  regenerateActivity,
  regenerateFinalProduct,
  generateEvaluationInstruments,
  generateDiversityMeasures,
  isAIConfigured
} from './services/geminiService';
import { useAuth } from './lib/AuthContext';
import { db } from './lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  setDoc, 
  getDocs,
  doc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

interface AutoResizeTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  placeholder?: string;
}

function AutoResizeTextArea({ value, onChange, className, ...props }: AutoResizeTextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      className={`${className} overflow-hidden resize-none`}
      {...props}
    />
  );
}

const getCategoryColor = (category?: string) => {
  switch (category) {
    case 'motivación': return 'bg-pink-100 text-pink-700 border-pink-200';
    case 'activación': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'exploración': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'estructuración': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'aplicación': return 'bg-green-100 text-green-700 border-green-200';
    case 'conclusión': return 'bg-gray-100 text-gray-700 border-gray-200';
    default: return 'bg-gray-50 text-gray-400 border-gray-100';
  }
};

function WelcomeScreen({ onLogin, loading, isFirebaseEnabled }: { onLogin: () => void, loading: boolean, isFirebaseEnabled: boolean }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl w-full flex flex-col items-center gap-8">
        <div className="flex flex-col items-center">
          <div className="flex items-baseline leading-none mb-4">
            <span className="text-6xl md:text-8xl font-bold tracking-tighter serif text-primary italic">Kerygma</span>
            <span className="text-6xl md:text-8xl font-black tracking-tighter text-accent ml-1">APP</span>
          </div>
          <p className="text-lg md:text-xl font-medium text-gray-500 max-w-lg">
            Planificador de Situaciones de Aprendizaje de Religión Católica para Andalucía
          </p>
        </div>

        <div className="w-full max-w-sm pt-8">
          <button
            onClick={onLogin}
            disabled={loading || !isFirebaseEnabled}
            className="w-full py-5 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UserIcon className="w-6 h-6" />}
            Acceder con Google
          </button>
          {!isFirebaseEnabled && (
            <p className="mt-4 text-xs text-amber-600 font-bold uppercase tracking-widest">
              Firebase no configurado
            </p>
          )}
        </div>

        <div className="mt-12 max-w-md pt-8 border-t border-gray-100">
          <p className="text-[11px] text-gray-400 leading-relaxed italic">
            Esta aplicación está en fase de pruebas. Para aportar ideas o sugerencias, o reportar errores, escribe a <span className="font-bold text-gray-500">rhoyman823@g.educaand.es</span> con el asunto "Sugerencias KerygmaApp"
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { user, login, logout, loading, isFirebaseEnabled } = useAuth();
  const [blocks, setBlocks] = useState<CurriculumBlock[]>(() => {
    const saved = localStorage.getItem('kerygma_blocks');
    return saved ? JSON.parse(saved) : DEFAULT_CURRICULUM;
  });
  
  const [isFirestoreLoading, setIsFirestoreLoading] = useState(true);
  const [syncingCount, setSyncingCount] = useState(0);
  const isSyncing = syncingCount > 0;
  const [isAIReady, setIsAIReady] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  const checkAI = async () => {
    const ready = await isAIConfigured();
    setIsAIReady(ready);
    console.log(`AI Status: ${ready ? 'Active' : 'Missing Key'}`);
  };

  useEffect(() => {
    checkAI();
  }, []);
  const [activeBlockId, setActiveBlockId] = useState<string>(blocks[0]?.id || '');
  const syncTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportContent, setExportContent] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const tokenRef = useRef<string | null>(null);

  const handleExport = (blockToExport?: CurriculumBlock) => {
    const targetBlock = blockToExport || activeBlock;
    if (!targetBlock) return;
    
    if (!targetBlock.activities || targetBlock.activities.length === 0) {
      alert("Debes completar la situación de aprendizaje hasta el paso de Secuenciación para exportar.");
      return;
    }
    
    const content = generateMarkdownContent(targetBlock);
    setExportContent(content);
  };

  function generateMarkdownContent(block: CurriculumBlock) {
    let content = `# Planificación de Religión Católica: ${formatLevelDisplay(block.level, block.stage)} (${block.stage})\n\n`;
    content += `## Título: ${block.title || 'Nueva Situación de Aprendizaje'}\n\n`;
    
    content += `## Competencias Específicas y Criterios de Evaluación\n\n`;
    block.competenciasEspecíficas.forEach(ce => {
      const selectedCrits = ce.criteriosEvaluación.filter(c => c.selected);
      if (selectedCrits.length > 0) {
        content += `### ${ce.description}\n\n`;
        selectedCrits.forEach(crit => {
          const minTag = crit.isMinimum ? ' [MÍNIMO]' : '';
          content += `- **Criterio:** ${crit.description}${minTag}\n`;
          if (crit.concreción) {
            content += `  - *Concreción:* ${crit.concreción}\n`;
          }
          if (crit.linkedSaberesIds && crit.linkedSaberesIds.length > 0) {
            const linkedSaberes = block.saberesBásicos
              .filter(s => crit.linkedSaberesIds?.includes(s.id))
              .map(s => s.description)
              .join(', ');
            content += `  - *Saberes vinculados:* ${linkedSaberes}\n`;
          }
        });
        content += `\n`;
      }
    });
    
    const selectedSaberes = block.saberesBásicos.filter(s => s.selected);
    if (selectedSaberes.length > 0) {
      content += `## Saberes Básicos\n\n`;
      selectedSaberes.forEach(sb => {
        const minTag = sb.isMinimum ? ' [MÍNIMO]' : '';
        content += `### [${sb.category}] ${sb.description}${minTag}\n\n`;
        if (sb.concreción) {
          content += `${sb.concreción}\n\n`;
        }
      });
    }

    if (block.plan) {
      content += `## Planificación Didáctica\n\n`;
      if (block.plan.justification) {
        content += `### Justificación\n${block.plan.justification}\n\n`;
      }
      if (block.plan.suggestedContent) {
        content += `### Desarrollo de Contenidos\n${block.plan.suggestedContent}\n\n`;
      }
      if (block.plan.methodology) {
        content += `### Metodología\n${block.plan.methodology}\n\n`;
      }
      
      const productTitle = block.plan.finalProductTitle || block.plan.finalProduct || 'No definido';
      content += `### Producto Final: ${productTitle}\n`;
      content += `*${block.plan.finalProductMode === 'cumulative' ? 'Propuesta Acumulativa' : 'Actividad de Síntesis'}*\n\n`;
      if (block.plan.finalProductDescription) {
        content += `**Descripción**\n${block.plan.finalProductDescription}\n\n`;
      }
    }

    if (block.activities && block.activities.length > 0) {
      content += `## Secuenciación de Actividades\n\n`;
      block.activities.forEach((act, i) => {
        content += `### Actividad ${i + 1}: ${act.title}\n`;
        if (act.category) {
          content += `**Tipo:** ${act.category.charAt(0).toUpperCase() + act.category.slice(1)}\n`;
        }
        content += `**Descripción:** ${act.description}\n\n`;
        content += `- **Temporalización:** ${act.timing}\n`;
        content += `- **Recursos:** ${act.resources}\n`;
        if (act.criteria) {
          content += `- **Criterios de Evaluación:** ${act.criteria}\n`;
        }
        content += `\n`;
      });
    }

    if (block.evaluation && block.evaluation.instruments.length > 0) {
      content += `## Evaluación\n\n`;
      block.evaluation.instruments.forEach(inv => {
        content += `### ${inv.name}\n`;
        content += `${inv.description}\n`;
        if (inv.linkedActivitiesIds.length > 0) {
           content += `*Relacionado con: ${inv.linkedActivitiesIds.map(id => `Actividad ${Number(id)+1}`).join(', ')}*\n`;
        }
        content += `\n`;
      });
      if (block.evaluation.generalCriteria) {
        content += `**Observaciones Generales de Evaluación:**\n${block.evaluation.generalCriteria}\n\n`;
      }
    }

    if (block.diversity && block.diversity.measures.length > 0) {
      content += `## Atención a la Diversidad\n\n`;
      block.diversity.measures.forEach(m => {
        content += `### [${m.type}] ${m.need}\n`;
        content += `**Medida:** ${m.measure}\n`;
        content += `**Ajustes Metodológicos:** ${m.methodologyAdjustments}\n\n`;
      });
      if (block.diversity.generalObservations) {
        content += `**Observaciones Generales de Diversidad:**\n${block.diversity.generalObservations}\n\n`;
      }
    }

    return content;
  }

  const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: user?.uid,
        email: user?.email,
        emailVerified: user?.emailVerified,
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    // We don't throw here to avoid crashing the whole app, but we log it correctly for debugging
  };

  // Sync with Firestore when logged in
  useEffect(() => {
    if (!db) return;

    // Si aún está cargando la autenticación, no hacemos nada
    if (loading) return;

    if (!user) {
      // RESET to local when logged out
      const saved = localStorage.getItem('kerygma_blocks');
      let local = [];
      try {
        local = saved ? JSON.parse(saved) : DEFAULT_CURRICULUM;
      } catch (e) {
        local = DEFAULT_CURRICULUM;
      }
      setBlocks(local);
      if (local.length > 0) {
        setActiveBlockId(prev => local.find(b => b.id === prev) ? prev : local[0].id);
      }
      setIsFirestoreLoading(false);
      return;
    }
    
    setIsFirestoreLoading(true);
    
    // First, fetch current cloud data
    const q = query(collection(db, 'situations'), where('userId', '==', user.uid));
    
    // We'll use getDocs once to see if we need to migrate local data
    const checkMigration = async () => {
      try {
        const snapshot = await getDocs(q);
        const cloudBlocks = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as CurriculumBlock));
        
        // If cloud blocks exist, we only sync local ones that are missing
        const localSaved = localStorage.getItem('kerygma_blocks');
        if (localSaved) {
          const localBlocks: CurriculumBlock[] = JSON.parse(localSaved);
          // Only sync if they are meaningful (not just some leftover defaults)
          const meaningfulBlocks = localBlocks.filter(b => b.initialized || b.title);
          
          for (const block of meaningfulBlocks) {
            // Ensure ID doesn't collide with other users if it was a default
            const isDefault = block.id.startsWith('primaria-') || block.id.startsWith('infantil-') || block.id.startsWith('secundaria-') || block.id.startsWith('bach-');
            const safeId = isDefault && !block.id.includes(user.uid.slice(0, 5))
              ? `${block.id}-${user.uid.slice(0, 5)}` 
              : block.id;
            
            // Sync if not in cloud
            if (!cloudBlocks.find(cb => cb.id === safeId)) {
              await syncBlock({ ...block, id: safeId, userId: user.uid });
            }
          }
        }
      } catch (e) {
        console.error("Migration error:", e);
      }
    };

    checkMigration();

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const remoteBlocks = snapshot.docs.map(doc => {
        const data = doc.data() as CurriculumBlock;
        return { ...data, id: doc.id };
      });
      
      // Sync with cloud
      if (remoteBlocks.length >= 0) {
        setBlocks(remoteBlocks);
        setActiveBlockId(current => {
          if (!current || !remoteBlocks.find(b => b.id === current)) {
            return remoteBlocks[0]?.id || '';
          }
          return current;
        });
      }

      setIsFirestoreLoading(false);
    }, (error) => {
      console.error("Firestore onSnapshot error:", error);
      handleFirestoreError(error, OperationType.LIST, 'situations');
      setIsFirestoreLoading(false);
    });

    return () => unsubscribe();
  }, [user, db, loading]);

  const syncBlock = async (block: CurriculumBlock) => {
    if (!user || !db) return;
    
    // Debounce sync
    if (syncTimeoutRef.current[block.id]) {
      clearTimeout(syncTimeoutRef.current[block.id]);
    }

    syncTimeoutRef.current[block.id] = setTimeout(async () => {
      setSyncingCount(prev => prev + 1);
      
      const sanitize = (obj: any): any => {
        if (Array.isArray(obj)) return obj.map(sanitize);
        if (obj !== null && typeof obj === 'object') {
          if (Object.getPrototypeOf(obj) !== Object.prototype) return obj;
          const result: any = {};
          Object.entries(obj).forEach(([key, value]) => {
            if (value !== undefined) result[key] = sanitize(value);
          });
          return result;
        }
        return obj;
      };

      try {
        if (isSyncing) { // Just for a bit of logging or tracking if needed
          // console.log("Syncing block:", block.id);
        }
        const sanitizedBlock = sanitize({ 
          ...block, 
          userId: user.uid,
          updatedAt: serverTimestamp() 
        });
        await setDoc(doc(db, 'situations', sanitizedBlock.id), sanitizedBlock, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `situations/${block.id}`);
      } finally {
        setSyncingCount(prev => Math.max(0, prev - 1));
        delete syncTimeoutRef.current[block.id];
      }
    }, 1000); // 1 second debounce
  };

  // Local storage persistence Cache
  useEffect(() => {
    localStorage.setItem('kerygma_blocks', JSON.stringify(blocks));
  }, [blocks]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeBlock = blocks.find(b => b.id === activeBlockId);

  const setStep = (step: 'selection' | 'planning' | 'sequencing') => {
    if (activeBlock) {
      updateBlock(activeBlock.id, { step });
    }
  };

  const handleAnalyzeContent = async () => {
    if (!activeBlock || !activeBlock.materials) return;
    setIsAnalyzing(true);

    try {
      // Prepare curriculum context for AI
      const context = {
        competencias: (activeBlock.stage === 'Secundaria' ? COMPETENCIAS_ESO : activeBlock.stage === 'Bachillerato' ? COMPETENCIAS_BACHILLERATO : activeBlock.stage === 'Infantil' ? COMPETENCIAS_INFANTIL : activeBlock.stage === 'Primaria' ? COMPETENCIAS_PRIMARIA : [])
          .map(ce => {
            let criteria: Criterio[] = [];
            if (activeBlock.stage === 'Secundaria') {
              if (activeBlock.level === '1º ESO') criteria = CRITERIOS_ESO_1[ce.id] || [];
              else if (activeBlock.level === '2º ESO') criteria = CRITERIOS_ESO_2[ce.id] || [];
              else if (activeBlock.level === '3º ESO') criteria = CRITERIOS_ESO_3[ce.id] || [];
              else if (activeBlock.level === '4º ESO') criteria = CRITERIOS_ESO_4[ce.id] || [];
            } else if (activeBlock.stage === 'Infantil') {
              if (activeBlock.level === '3 años') criteria = CRITERIOS_INFANTIL_3ANOS[ce.id] || [];
              else if (activeBlock.level === '4 años') criteria = CRITERIOS_INFANTIL_4ANOS[ce.id] || [];
              else if (activeBlock.level === '5 años') criteria = CRITERIOS_INFANTIL_5ANOS[ce.id] || [];
            } else if (activeBlock.stage === 'Primaria') {
              if (activeBlock.level === '1º Primaria') criteria = CRITERIOS_PRIMARIA_1[ce.id] || [];
              else if (activeBlock.level === '2º Primaria') criteria = CRITERIOS_PRIMARIA_2[ce.id] || [];
              else if (activeBlock.level === '3º Primaria') criteria = CRITERIOS_PRIMARIA_3[ce.id] || [];
              else if (activeBlock.level === '4º Primaria') criteria = CRITERIOS_PRIMARIA_4[ce.id] || [];
              else if (activeBlock.level === '5º Primaria') criteria = CRITERIOS_PRIMARIA_5[ce.id] || [];
              else if (activeBlock.level === '6º Primaria') criteria = CRITERIOS_PRIMARIA_6[ce.id] || [];
            }
            
            return { id: ce.id, description: ce.description, criterios: criteria };
          }),
        saberes: activeBlock.stage === 'Secundaria' 
          ? ((activeBlock.level === '1º ESO' || activeBlock.level === '2º ESO') ? SABERES_ESO_1_2 : SABERES_ESO_3_4)
          : activeBlock.stage === 'Infantil'
            ? SABERES_INFANTIL
            : activeBlock.stage === 'Primaria'
            ? (activeBlock.level === '1º Primaria' || activeBlock.level === '2º Primaria' ? SABERES_PRIMARIA_1_2 : activeBlock.level === '3º Primaria' || activeBlock.level === '4º Primaria' ? SABERES_PRIMARIA_3_4 : activeBlock.level === '5º Primaria' || activeBlock.level === '6º Primaria' ? SABERES_PRIMARIA_5_6 : [])
            : activeBlock.stage === 'Bachillerato'
            ? SABERES_BACHILLERATO
            : []
      };

      const result = await analyzeExistingContent(activeBlock.materials, context);

      let updatedBlock: CurriculumBlock | null = null;
      setBlocks(prev => prev.map(b => {
        if (b.id !== activeBlock.id) return b;
        
        const currentCompetencias = activeBlock.stage === 'Secundaria' ? COMPETENCIAS_ESO : activeBlock.stage === 'Infantil' ? COMPETENCIAS_INFANTIL : activeBlock.stage === 'Primaria' ? COMPETENCIAS_PRIMARIA : [];

        const updated = {
          ...b,
          competenciasEspecíficas: currentCompetencias
            .map(ce => {
              let allCriteria: Criterio[] = [];
              if (activeBlock.stage === 'Secundaria') {
                if (activeBlock.level === '1º ESO') allCriteria = CRITERIOS_ESO_1[ce.id] || [];
                else if (activeBlock.level === '2º ESO') allCriteria = CRITERIOS_ESO_2[ce.id] || [];
                else if (activeBlock.level === '3º ESO') allCriteria = CRITERIOS_ESO_3[ce.id] || [];
                else if (activeBlock.level === '4º ESO') allCriteria = CRITERIOS_ESO_4[ce.id] || [];
              } else if (activeBlock.stage === 'Infantil') {
                if (activeBlock.level === '3 años') allCriteria = CRITERIOS_INFANTIL_3ANOS[ce.id] || [];
                else if (activeBlock.level === '4 años') allCriteria = CRITERIOS_INFANTIL_4ANOS[ce.id] || [];
                else if (activeBlock.level === '5 años') allCriteria = CRITERIOS_INFANTIL_5ANOS[ce.id] || [];
              } else if (activeBlock.stage === 'Primaria') {
                if (activeBlock.level === '1º Primaria') allCriteria = CRITERIOS_PRIMARIA_1[ce.id] || [];
                else if (activeBlock.level === '2º Primaria') allCriteria = CRITERIOS_PRIMARIA_2[ce.id] || [];
                else if (activeBlock.level === '3º Primaria') allCriteria = CRITERIOS_PRIMARIA_3[ce.id] || [];
                else if (activeBlock.level === '4º Primaria') allCriteria = CRITERIOS_PRIMARIA_4[ce.id] || [];
                else if (activeBlock.level === '5º Primaria') allCriteria = CRITERIOS_PRIMARIA_5[ce.id] || [];
                else if (activeBlock.level === '6º Primaria') allCriteria = CRITERIOS_PRIMARIA_6[ce.id] || [];
              }
              
              return {
                ...ce,
                criteriosEvaluación: allCriteria.map(crit => ({
                  ...crit,
                  selected: result.critIds.includes(crit.id)
                }))
              };
            }),
          saberesBásicos: context.saberes.map(s => ({
            ...s,
            selected: result.saberIds.includes(s.id)
          }))
        };
        updatedBlock = updated;
        return updated;
      }));
      if (updatedBlock) syncBlock(updatedBlock);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEvaluateLinks = async (ceId: string, crit: Criterio) => {
    if (!activeBlock) return;
    setIsEvaluating(crit.id);
    
    const saberesContext = activeBlock.saberesBásicos.map(s => ({ id: s.id, description: s.description }));
    const links = await evaluateLinks(crit.description, saberesContext);
    
    let updatedBlock: CurriculumBlock | null = null;
    setBlocks(prev => {
      const next = prev.map(b => {
        if (b.id !== activeBlock.id) return b;
        const updated = {
          ...b,
          competenciasEspecíficas: b.competenciasEspecíficas.map(ce => {
            if (ce.id !== ceId) return ce;
            return {
              ...ce,
              criteriosEvaluación: ce.criteriosEvaluación.map(c => 
                c.id === crit.id ? { ...c, linkedSaberesIds: links } : c
              )
            };
          })
        };
        updatedBlock = updated;
        return updated;
      });
      return next;
    });
    
    if (updatedBlock) syncBlock(updatedBlock);
    setIsEvaluating(null);
  };

  const toggleSaberLink = (ceId: string, critId: string, saberId: string) => {
    if (!activeBlock) return;
    let updatedBlock: CurriculumBlock | null = null;
    setBlocks(prev => {
      const next = prev.map(b => {
        if (b.id !== activeBlock.id) return b;
        const updated = {
          ...b,
          competenciasEspecíficas: b.competenciasEspecíficas.map(ce => {
            if (ce.id !== ceId) return ce;
            return {
              ...ce,
              criteriosEvaluación: ce.criteriosEvaluación.map(crit => {
                if (crit.id !== critId) return crit;
                const currentLinks = crit.linkedSaberesIds || [];
                const newLinks = currentLinks.includes(saberId)
                  ? currentLinks.filter(id => id !== saberId)
                  : [...currentLinks, saberId];
                return { ...crit, linkedSaberesIds: newLinks };
              })
            };
          })
        };
        updatedBlock = updated;
        return updated;
      });
      return next;
    });
    if (updatedBlock) syncBlock(updatedBlock);
  };

  const updateBlock = (blockId: string, updates: Partial<CurriculumBlock>) => {
    let updatedBlock: CurriculumBlock | null = null;
    setBlocks(prev => {
      const block = prev.find(b => b.id === blockId);
      if (!block) return prev;

      let targetId = blockId;
      const isDefault = blockId.startsWith('primaria-') || blockId.startsWith('infantil-') || blockId.startsWith('secundaria-') || blockId.startsWith('bach-');
      if (user && isDefault && !blockId.includes(user.uid.slice(0, 5))) {
        targetId = `${blockId}-${user.uid.slice(0, 5)}`;
      }

      const updated = { ...block, ...updates, id: targetId };
      updatedBlock = updated;
      
      const next = prev.map(b => b.id === blockId ? updated : b);
      return next;
    });

    if (updatedBlock) {
      syncBlock(updatedBlock);
      const newId = (updatedBlock as CurriculumBlock).id;
      if (newId !== blockId && activeBlockId === blockId) {
        setActiveBlockId(newId);
      }
    }
  };

  const handleStageChange = (blockId: string, stage: string) => {
    const levels = STAGE_LEVELS[stage] || [];
    const defaultLevel = levels[0] || stage;
    updateBlock(blockId, { stage: stage as any, level: defaultLevel });
  };

  const handleExportCurriculumCSV = () => {
    // Generate CSV for ESO as requested
    let csv = "Etapa;Competencia_ID;Competencia_Desc;Criterio_ID;Criterio_Desc;Nivel\n";
    
    COMPETENCIAS_ESO.forEach(ce => {
      const levels = ["1º ESO", "2º ESO", "3º ESO", "4º ESO"];
      const criteriaMaps = [CRITERIOS_ESO_1, CRITERIOS_ESO_2, CRITERIOS_ESO_3, CRITERIOS_ESO_4];
      
      levels.forEach((lvl, idx) => {
        const criteria = criteriaMaps[idx][ce.id] || [];
        criteria.forEach(crit => {
          csv += `Secundaria;"${ce.id}";"${ce.description.replace(/"/g, '""')}";"${crit.id}";"${crit.description.replace(/"/g, '""')}";"${lvl}"\n`;
        });
      });
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "curriculo_religion_eso.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLevelChange = (blockId: string, level: string) => {
    updateBlock(blockId, { level });
  };

  const initializeCurriculum = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    let updates: Partial<CurriculumBlock> = { 
      initialized: true,
      step: 'selection',
      creationMode: 'curriculum'
    };
    const { stage, level } = block;

    if (stage === 'Secundaria') {
      if (level === '1º ESO') {
        updates.competenciasEspecíficas = COMPETENCIAS_ESO.map(ce => ({
          ...ce,
          criteriosEvaluación: CRITERIOS_ESO_1[ce.id] || []
        }));
      } else if (level === '2º ESO') {
        updates.competenciasEspecíficas = COMPETENCIAS_ESO.map(ce => ({
          ...ce,
          criteriosEvaluación: CRITERIOS_ESO_2[ce.id] || []
        }));
      } else if (level === '3º ESO') {
        updates.competenciasEspecíficas = COMPETENCIAS_ESO.map(ce => ({
          ...ce,
          criteriosEvaluación: CRITERIOS_ESO_3[ce.id] || []
        }));
      } else if (level === '4º ESO') {
        updates.competenciasEspecíficas = COMPETENCIAS_ESO.map(ce => ({
          ...ce,
          criteriosEvaluación: CRITERIOS_ESO_4[ce.id] || []
        }));
      } else {
        updates.competenciasEspecíficas = COMPETENCIAS_ESO.map(ce => ({
          ...ce,
          criteriosEvaluación: []
        }));
      }

      if (level === '1º ESO' || level === '2º ESO') {
        updates.saberesBásicos = SABERES_ESO_1_2;
      } else if (level === '3º ESO' || level === '4º ESO') {
        updates.saberesBásicos = SABERES_ESO_3_4;
      } else {
        updates.saberesBásicos = [];
      }
    } else if (stage === 'Infantil') {
      if (level === '3 años') {
        updates.competenciasEspecíficas = COMPETENCIAS_INFANTIL.map(ce => ({
          ...ce,
          criteriosEvaluación: CRITERIOS_INFANTIL_3ANOS[ce.id] || []
        }));
      } else if (level === '4 años') {
        updates.competenciasEspecíficas = COMPETENCIAS_INFANTIL.map(ce => ({
          ...ce,
          criteriosEvaluación: CRITERIOS_INFANTIL_4ANOS[ce.id] || []
        }));
      } else if (level === '5 años') {
        updates.competenciasEspecíficas = COMPETENCIAS_INFANTIL.map(ce => ({
          ...ce,
          criteriosEvaluación: CRITERIOS_INFANTIL_5ANOS[ce.id] || []
        }));
      } else {
        updates.competenciasEspecíficas = COMPETENCIAS_INFANTIL.map(ce => ({
          ...ce,
          criteriosEvaluación: []
        }));
      }
      updates.saberesBásicos = SABERES_INFANTIL;
    } else if (stage === 'Bachillerato') {
      updates.competenciasEspecíficas = COMPETENCIAS_BACHILLERATO.map(ce => ({
        ...ce,
        criteriosEvaluación: []
      }));
      updates.saberesBásicos = SABERES_BACHILLERATO;
    } else if (stage === 'Primaria') {
      if (level === '1º Primaria') {
        updates.competenciasEspecíficas = COMPETENCIAS_PRIMARIA.map(ce => ({
          ...ce,
          criteriosEvaluación: CRITERIOS_PRIMARIA_1[ce.id] || []
        }));
      } else if (level === '2º Primaria') {
        updates.competenciasEspecíficas = COMPETENCIAS_PRIMARIA.map(ce => ({
          ...ce,
          criteriosEvaluación: CRITERIOS_PRIMARIA_2[ce.id] || []
        }));
      } else if (level === '3º Primaria') {
        updates.competenciasEspecíficas = COMPETENCIAS_PRIMARIA.map(ce => ({
          ...ce,
          criteriosEvaluación: CRITERIOS_PRIMARIA_3[ce.id] || []
        }));
      } else if (level === '4º Primaria') {
        updates.competenciasEspecíficas = COMPETENCIAS_PRIMARIA.map(ce => ({
          ...ce,
          criteriosEvaluación: CRITERIOS_PRIMARIA_4[ce.id] || []
        }));
      } else if (level === '5º Primaria') {
        updates.competenciasEspecíficas = COMPETENCIAS_PRIMARIA.map(ce => ({
          ...ce,
          criteriosEvaluación: CRITERIOS_PRIMARIA_5[ce.id] || []
        }));
      } else if (level === '6º Primaria') {
        updates.competenciasEspecíficas = COMPETENCIAS_PRIMARIA.map(ce => ({
          ...ce,
          criteriosEvaluación: CRITERIOS_PRIMARIA_6[ce.id] || []
        }));
      } else {
        updates.competenciasEspecíficas = COMPETENCIAS_PRIMARIA.map(ce => ({
          ...ce,
          criteriosEvaluación: []
        }));
      }
      if (level === '1º Primaria' || level === '2º Primaria') {
        updates.saberesBásicos = SABERES_PRIMARIA_1_2;
      } else if (level === '3º Primaria' || level === '4º Primaria') {
        updates.saberesBásicos = SABERES_PRIMARIA_3_4;
      } else if (level === '5º Primaria' || level === '6º Primaria') {
        updates.saberesBásicos = SABERES_PRIMARIA_5_6;
      } else {
        updates.saberesBásicos = [];
      }
    } else {
      updates.competenciasEspecíficas = [];
      updates.saberesBásicos = [];
    }

    updateBlock(blockId, updates);
  };

  const updateConcrecion = (blockId: string, type: 'criterio' | 'saber', parentId: string, id: string, value: string) => {
    let updatedBlock: CurriculumBlock | null = null;
    setBlocks(prev => {
      const next = prev.map(b => {
        if (b.id !== blockId) return b;
        
        const newBlock = { ...b };
        if (type === 'criterio') {
          newBlock.competenciasEspecíficas = b.competenciasEspecíficas.map(ce => {
            if (ce.id !== parentId) return ce;
            return {
              ...ce,
              criteriosEvaluación: ce.criteriosEvaluación.map(crit => 
                crit.id === id ? { ...crit, concreción: value } : crit
              )
            };
          });
        } else {
          newBlock.saberesBásicos = b.saberesBásicos.map(sb => 
            sb.id === id ? { ...sb, concreción: value } : sb
          );
        }
        updatedBlock = newBlock;
        return newBlock;
      });
      return next;
    });
    if (updatedBlock) syncBlock(updatedBlock);
  };

  const handleSuggest = async (type: 'criterio' | 'saber', parentId: string, item: Criterio | SaberBásico) => {
    if (!activeBlock) return;
    setIsGenerating(item.id);
    const suggestion = await suggestConcrecion(activeBlock.stage, activeBlock.level, item.description, type);
    updateConcrecion(activeBlock.id, type, parentId, item.id, suggestion);
    setIsGenerating(null);
  };

  const toggleElementSelection = (blockId: string, type: 'criterio' | 'saber', parentId: string, id: string) => {
    let updatedBlock: CurriculumBlock | null = null;
    setBlocks(prev => {
      const next = prev.map(b => {
        if (b.id !== blockId) return b;
        const nb = { ...b };
        if (type === 'criterio') {
          nb.competenciasEspecíficas = b.competenciasEspecíficas.map(ce => {
            if (ce.id !== parentId) return ce;
            const newCriterios = ce.criteriosEvaluación.map(c => 
              c.id === id ? { ...c, selected: !c.selected } : c
            );
            return {
              ...ce,
              criteriosEvaluación: newCriterios
            };
          });
        } else {
          nb.saberesBásicos = b.saberesBásicos.map(s => 
            s.id === id ? { ...s, selected: !s.selected } : s
          );
        }
        updatedBlock = nb;
        return nb;
      });
      return next;
    });
    if (updatedBlock) syncBlock(updatedBlock);
  };

  const getSelectedCounts = (block: CurriculumBlock) => {
    let ceCount = 0;
    let critCount = 0;
    let saberCount = (block.saberesBásicos || []).filter(s => s.selected).length;
    
    (block.competenciasEspecíficas || []).forEach(ce => {
      const selectedCrits = (ce.criteriosEvaluación || []).filter(c => c.selected);
      if (selectedCrits.length > 0) {
        ceCount++;
        critCount += selectedCrits.length;
      }
    });
    
    return { ceCount, critCount, saberCount };
  };

  const addNewBlock = () => {
    const id = `block-${Date.now()}`;
    const newBlock: CurriculumBlock = {
      id,
      userId: user?.uid,
      title: '',
      stage: 'Secundaria', 
      level: '1º ESO',
      initialized: false,
      step: 'selection',
      competenciasEspecíficas: [],
      saberesBásicos: []
    };
    
    setBlocks(prev => [...prev, newBlock]);
    setActiveBlockId(id);
    
    // Sync to Firestore immediately if logged in
    if (user && db) {
      syncBlock(newBlock);
    }
  };

  const removeBlock = (id: string) => {
    setDeleteConfirmation(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmation) return;
    const id = deleteConfirmation;
    
    // Optimistic local delete
    setBlocks(prev => {
      const next = prev.filter(b => b.id !== id);
      if (activeBlockId === id) {
        setActiveBlockId(next[0]?.id || '');
      }
      return next;
    });
    setDeleteConfirmation(null);

    // Remote delete if logged in
    if (user && db) {
      try {
        await deleteDoc(doc(db, 'situations', id));
      } catch (error) {
        console.error("Delete failed:", error);
        handleFirestoreError(error, OperationType.DELETE, `situations/${id}`);
        // Optional: Re-add to state if delete fails?
      }
    }
  };

  const handleAutoLinkSaberes = async () => {
    if (!activeBlock) return;
    
    const selectedCriteriaDescriptions: string[] = [];
    activeBlock.competenciasEspecíficas.forEach(ce => {
      ce.criteriosEvaluación.forEach(c => {
        if (c.selected) selectedCriteriaDescriptions.push(c.description);
      });
    });

    if (selectedCriteriaDescriptions.length === 0) return;

    setIsEvaluating('global-saberes');
    const suggestedIds = await suggestSaberesForCriteria(selectedCriteriaDescriptions, activeBlock.saberesBásicos);
    
    let updatedBlock: CurriculumBlock | null = null;
    setBlocks(prev => {
      const next = prev.map(b => {
        if (b.id !== activeBlock.id) return b;
        const updated = {
          ...b,
          saberesBásicos: b.saberesBásicos.map(s => ({
            ...s,
            selected: suggestedIds.length > 0 ? suggestedIds.includes(s.id) : s.selected
          }))
        };
        updatedBlock = updated;
        return updated;
      });
      return next;
    });
    if (updatedBlock) syncBlock(updatedBlock);
    setIsEvaluating(null);
  };

  const handleGeneratePlanning = async () => {
    if (!activeBlock) return;
    setIsAnalyzing(true);
    
    // Prepare curriculum summary for prompt
    const { ceCount, critCount, saberCount } = getSelectedCounts(activeBlock);
    let summary = "";
    activeBlock.competenciasEspecíficas.forEach(ce => {
      const selectedCrits = ce.criteriosEvaluación.filter(c => c.selected);
      if (selectedCrits.length > 0) {
        summary += `- Competencia: ${ce.description}\n`;
        selectedCrits.forEach(c => summary += `  * Criterio (${c.id}): ${c.description}\n`);
      }
    });
    const selectedSaberes = activeBlock.saberesBásicos.filter(s => s.selected);
    selectedSaberes.forEach(s => summary += `- Saber: ${s.description}\n`);

    const suggestion = await suggestUnitContent(summary, activeBlock.materials, activeBlock.planningNotes);
    
    updateBlock(activeBlock.id, { 
      step: 'planning',
      plan: {
        suggestedContent: suggestion,
        methodology: '',
        finalProductMode: 'compilatory',
        finalProduct: '',
        numberOfActivities: 5
      }
    });
    setIsAnalyzing(false);
  };

  const handleRegeneratePlanning = async () => {
    if (!activeBlock || !activeBlock.plan) return;
    setIsAnalyzing(true);
    
    let summary = "";
    activeBlock.competenciasEspecíficas.forEach(ce => {
      const selectedCrits = ce.criteriosEvaluación.filter(c => c.selected);
      if (selectedCrits.length > 0) {
        summary += `- Competencia: ${ce.description}\n`;
        selectedCrits.forEach(c => summary += `  * Criterio (${c.id}): ${c.description}\n`);
      }
    });
    const selectedSaberes = activeBlock.saberesBásicos.filter(s => s.selected).map(s => s.description).join('\n- ');

    const suggestion = await suggestUnitContent(summary + "\n" + selectedSaberes, activeBlock.materials, (activeBlock.planningNotes || "") + "\nPrueba algo diferente a lo anterior.");
    
    updateBlock(activeBlock.id, { 
      plan: { ...activeBlock.plan, suggestedContent: suggestion }
    });
    setIsAnalyzing(false);
  };

  const handleGenerateSequencingAction = async () => {
    if (!activeBlock || !activeBlock.plan) return;
    setIsAnalyzing(true);
    
    let summary = "";
    activeBlock.competenciasEspecíficas.forEach(ce => {
      const selectedCrits = ce.criteriosEvaluación.filter(c => c.selected);
      if (selectedCrits.length > 0) {
        summary += `- Competencia: ${ce.description}\n`;
        selectedCrits.forEach(c => summary += `  * Criterio (${c.id}): ${c.description}\n`);
      }
    });
    
    const result = await generateSequencing(
      summary,
      activeBlock.plan.suggestedContent,
      activeBlock.plan.methodology,
      activeBlock.plan.finalProductMode,
      activeBlock.plan.numberOfActivities || 5
    );
    
    updateBlock(activeBlock.id, { 
      step: 'sequencing',
      activities: result.activities,
      plan: { 
        ...activeBlock.plan, 
        finalProduct: result.finalProduct,
        justification: result.justification
      }
    });
    setIsAnalyzing(false);
  };

  const handleRegenerateSpecificActivity = async (index: number) => {
    if (!activeBlock || !activeBlock.activities || !activeBlock.plan) return;
    const activityId = activeBlock.activities[index].id;
    setIsGenerating(activityId);
    
    // Prepare curriculum summary
    let currSummary = "";
    activeBlock.competenciasEspecíficas.forEach(ce => {
      const selectedCrits = ce.criteriosEvaluación.filter(c => c.selected);
      if (selectedCrits.length > 0) {
        currSummary += `- CE: ${ce.description}\n`;
        selectedCrits.forEach(c => currSummary += `  * Criterio (${c.id}): ${c.description}\n`);
      }
    });

    const newActivity = await regenerateActivity(
      index,
      currSummary,
      activeBlock.plan.suggestedContent,
      activeBlock.plan.methodology,
      activeBlock.activities
    );

    const newList = [...activeBlock.activities];
    newList[index] = newActivity;
    updateBlock(activeBlock.id, { activities: newList });
    setIsGenerating(null);
  };

  const handleGenerateEvaluationAction = async () => {
    if (!activeBlock || !activeBlock.activities || !activeBlock.plan) return;
    setIsAnalyzing(true);
    
    const result = await generateEvaluationInstruments(
      activeBlock.activities.map(a => ({ title: a.title, description: a.description })),
      activeBlock.plan.suggestedContent,
      activeBlock.evaluationNotes
    );
    
    updateBlock(activeBlock.id, { 
      step: 'evaluation',
      evaluation: {
        instruments: result.instruments.map((ins, i) => ({ ...ins, id: `inst-${i}` })),
        generalCriteria: ''
      }
    });
    setIsAnalyzing(false);
  };

  const handleGenerateDiversityAction = async (needs: string) => {
    if (!activeBlock || !activeBlock.activities || !activeBlock.plan) return;
    setIsAnalyzing(true);
    
    const result = await generateDiversityMeasures(
      activeBlock.activities.map(a => ({ title: a.title, description: a.description })),
      activeBlock.plan.suggestedContent,
      needs
    );
    
    updateBlock(activeBlock.id, { 
      step: 'diversity',
      diversity: {
        measures: result.measures.map((m, i) => ({ ...m, id: `div-${i}` }) as any),
        generalObservations: `Necesidades atendidas: ${needs}`
      }
    });
    setIsAnalyzing(false);
  };

  const handleRegenerateFinalProductAction = async () => {
    if (!activeBlock || !activeBlock.plan) return;
    setIsAnalyzing(true);
    
    let summary = "";
    activeBlock.competenciasEspecíficas.forEach(ce => {
      const selectedCrits = ce.criteriosEvaluación.filter(c => c.selected);
      if (selectedCrits.length > 0) {
        summary += `- Competencia: ${ce.description}\n`;
        selectedCrits.forEach(c => summary += `  * Criterio (${c.id}): ${c.description}\n`);
      }
    });

    const result = await generateSequencing(
      summary,
      activeBlock.plan.suggestedContent,
      activeBlock.plan.methodology,
      activeBlock.plan.finalProductMode,
      activeBlock.plan.numberOfActivities || 5
    );

    updateBlock(activeBlock.id, { 
      activities: result.activities,
      plan: { 
        ...activeBlock.plan, 
        finalProduct: result.finalProduct,
        finalProductTitle: result.finalProductTitle,
        finalProductDescription: result.finalProductDescription,
        justification: result.justification
      }
    });
    setIsAnalyzing(false);
  };

  const formatLevelDisplay = (level: string, stage: string) => {
    if (!level) return '';
    const stageLower = stage.toLowerCase();
    const levelLower = level.toLowerCase();
    
    // For ESO, 1º ESO -> 1º
    if (levelLower.includes('eso') && stageLower === 'secundaria') {
      return level.replace(/eso/i, '').trim();
    }
    
    // For general case: if level includes stage name, remove it
    if (levelLower.includes(stageLower)) {
      return level.replace(new RegExp(stage, 'gi'), '').trim();
    }
    
    return level;
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'Infantil': return <Baby className="w-5 h-5" />;
      case 'Primaria': return <Users className="w-5 h-5" />;
      case 'Secundaria': return <School className="w-5 h-5" />;
      case 'Bachillerato': return <GraduationCap className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-sm font-bold uppercase tracking-widest text-primary/40">Iniciando sesión...</p>
      </div>
    );
  }

  if (!user) {
    return <WelcomeScreen onLogin={() => login('google')} loading={loading} isFirebaseEnabled={isFirebaseEnabled} />;
  }

  return (
    <div className="min-h-screen bg-background text-[#1A1A1A] font-sans flex flex-col h-screen overflow-hidden">
      {/* Mobile Header / Top Bar */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 z-50 md:hidden">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 -ml-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="flex flex-col">
          <div className="flex items-baseline leading-none">
            <span className="text-3xl font-bold tracking-tighter serif text-primary italic">Kerygma</span>
            <span className="text-3xl font-black tracking-tighter text-accent ml-0.5">APP</span>
          </div>
          <p className="text-[9px] text-gray-400 font-bold leading-tight mt-2 max-w-[200px]">
            Planificador de Situaciones de Aprendizaje de Religión Católica para Andalucía
          </p>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Overlay (Mobile) */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
          )}
        </AnimatePresence>
        
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ 
            width: isSidebarOpen ? (window.innerWidth < 768 ? '85%' : '288px') : '0px',
            x: (window.innerWidth < 768 && !isSidebarOpen) ? -320 : 0
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`fixed inset-y-0 left-0 z-50 md:relative md:z-10 bg-white border-r border-accent/20 flex flex-col overflow-hidden shadow-2xl md:shadow-none`}
        >
          <div className="flex-1 flex flex-col min-w-[288px] h-full">
        <div className="p-6 border-bottom border-gray-100">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <div className="flex items-baseline leading-none">
                <span className="text-4xl font-bold tracking-tighter serif text-primary italic">Kerygma</span>
                <span className="text-4xl font-black tracking-tighter text-accent ml-0.5">APP</span>
              </div>
              <p className="text-[10px] text-gray-400 font-bold leading-tight mt-2 max-w-[200px]">
                Planificador de Situaciones de Aprendizaje de Religión Católica para Andalucía
              </p>
            </div>
            
            {!isAIReady && (
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#D97706]">IA Pendiente</span>
                  </div>
                  <button 
                    onClick={checkAI}
                    className="p-1 hover:bg-amber-100 rounded transition-colors text-amber-600"
                  >
                    <RotateCw className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[9px] text-amber-600/70 leading-tight">
                  Configura <b>VITE_GEMINI_API_KEY</b> en los ajustes de tu despliegue (Vercel/GitHub).
                </p>
              </div>
            )}
            
            {!user && (
              <button 
                onClick={() => login('google')}
                disabled={!isFirebaseEnabled}
                className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  isFirebaseEnabled 
                    ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                Acceder con Google
              </button>
            )}

            {user && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 p-2 bg-accent/5 rounded-xl border border-accent/10">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-accent/20" />
                  ) : (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-primary truncate">{user.displayName || user.email}</p>
                      {isSyncing ? (
                        <Loader2 className="w-2.5 h-2.5 animate-spin text-accent" />
                      ) : (
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      )}
                    </div>
                    <button 
                      onClick={() => logout()}
                      className="text-[9px] text-accent font-bold uppercase tracking-widest hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <LogOut className="w-3 h-3" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="px-2 mb-4">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Situaciones de Aprendizaje</h3>
          </div>
          {blocks.map(block => (
            <div key={block.id} className="group relative">
              <div 
                className={`w-full flex flex-col p-1 rounded-xl transition-all ${
                  activeBlockId === block.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'hover:bg-accent/5 text-gray-600'
                }`}
              >
                <div 
                  onClick={() => setActiveBlockId(block.id)}
                  className="flex items-center gap-3 p-2 cursor-pointer rounded-lg"
                >
                  <div className={activeBlockId === block.id ? 'text-white' : 'text-gray-400'}>
                    {getStageIcon(block.stage)}
                  </div>
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="text-sm font-semibold truncate">
                      {block.title || 'Nueva Situación'}
                    </p>
                    <p className={`text-[10px] uppercase tracking-tighter truncate ${activeBlockId === block.id ? 'text-white/70' : 'text-gray-400'}`}>
                      {formatLevelDisplay(block.level, block.stage)} • {block.stage}
                    </p>
                  </div>
                </div>

                {activeBlockId === block.id && (
                  <div className="flex border-t border-white/10 mt-1">
                    <button 
                      onClick={() => handleExport(block)}
                      disabled={block.step !== 'sequencing'}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[9px] font-bold uppercase tracking-widest transition-colors rounded-bl-lg border-r border-white/10 ${
                        block.step === 'sequencing'
                          ? 'hover:bg-white/10 cursor-pointer'
                          : 'opacity-40 cursor-not-allowed'
                      }`}
                      title={block.step !== 'sequencing' ? 'Completa la secuenciación para exportar' : 'Exportar contenido'}
                    >
                      <ClipboardList className="w-3 h-3" />
                      <span>Exportar</span>
                    </button>
                    <div className="w-[1px] bg-white/10" />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBlock(block.id);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[9px] font-bold uppercase tracking-widest text-red-100 hover:bg-red-500 rounded-br-lg transition-colors shadow-none"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          <button 
            onClick={addNewBlock}
            className="w-full flex items-center justify-center gap-2 p-3 mt-4 border-2 border-dashed border-accent/20 rounded-xl text-accent/60 hover:border-accent hover:text-accent transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Nueva Situación</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex flex-col items-center gap-1">
            <p className="text-[9px] text-gray-400 text-center font-bold uppercase tracking-tighter">v1.1 • Religión Católica Andalucía</p>
          </div>
        </div>
      </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-50/30">
        <header className="bg-white border-b border-gray-100 z-30 shrink-0">
          <div className="h-16 px-6 flex items-center justify-between gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex p-2 -ml-2 text-primary hover:bg-primary/5 rounded-lg transition-colors mr-2 shrink-0"
              title={isSidebarOpen ? "Cerrar lateral" : "Abrir lateral"}
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-4 flex-1 min-w-0">
            {activeBlock && (activeBlock.creationMode || activeBlock.competenciasEspecíficas.length > 0) ? (
              <div className="flex items-center gap-3 w-full max-w-xl">
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full shrink-0">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{activeBlock.stage}</span>
                  <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span className="text-xs font-bold text-primary">{formatLevelDisplay(activeBlock.level, activeBlock.stage)}</span>
                </div>
                
                <input
                  type="text"
                  value={activeBlock.title || ''}
                  onChange={(e) => updateBlock(activeBlock.id, { title: e.target.value })}
                  placeholder="Título de la Situación..."
                  className="flex-1 bg-transparent border-none p-0 focus:ring-0 font-bold text-lg text-primary placeholder:text-gray-300"
                />
              </div>
            ) : null}
            </div>

            <div className="flex items-center gap-2 px-6">
              {activeBlock && activeBlock.initialized && activeBlock.creationMode && (
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 hover:bg-gray-50 rounded-xl text-gray-500 transition-colors"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>
          
          <AnimatePresence>
            {activeBlock && activeBlock.initialized && activeBlock.creationMode && (
              <motion.div 
                className={`${isMobileMenuOpen ? 'block' : 'hidden md:block'} border-t border-gray-100 bg-white md:bg-gray-50/20 overflow-hidden`}
              >
                <div className="px-6 py-2 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="relative w-full md:w-64">
                    <select
                      value={activeBlock.step}
                      onChange={(e) => {
                        updateBlock(activeBlock.id, { step: e.target.value as any });
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full appearance-none bg-white md:bg-white border border-gray-100 rounded-xl px-4 py-2 pr-10 text-[10px] font-bold uppercase tracking-widest text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all cursor-pointer"
                    >
                      {[
                        { id: 'selection', label: '1. Currículo' },
                        { id: 'planning', label: '2. Propuesta' },
                        { id: 'sequencing', label: '3. Aula' },
                        { id: 'evaluation', label: '4. Evaluación' },
                        { id: 'diversity', label: '5. Diversidad' }
                      ].map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 md:gap-3">
                    {activeBlock.step === 'selection' && (
                      <div className="flex items-center gap-3 bg-white px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
                        <div className="flex gap-3 pr-3 border-r border-gray-100">
                          <div className="flex flex-col items-center">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter leading-none">Comp.</span>
                            <span className="text-xs font-bold text-primary leading-none mt-1">{getSelectedCounts(activeBlock).ceCount}</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter leading-none">Crit.</span>
                            <span className="text-xs font-bold text-accent leading-none mt-1">{getSelectedCounts(activeBlock).critCount}</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter leading-none">Sab.</span>
                            <span className="text-xs font-bold text-primary/60 leading-none mt-1">{getSelectedCounts(activeBlock).saberCount}</span>
                          </div>
                        </div>
                        <button
                          onClick={handleGeneratePlanning}
                          disabled={isAnalyzing || getSelectedCounts(activeBlock).critCount === 0}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[9px] uppercase tracking-widest transition-all ${
                            isAnalyzing || getSelectedCounts(activeBlock).critCount === 0
                              ? 'bg-gray-50 text-gray-300'
                              : 'bg-primary/10 text-primary hover:bg-primary/20'
                          }`}
                        >
                          {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <ChevronRight className="w-3 h-3" />}
                          Continuar
                        </button>
                      </div>
                    )}

                    {/* Header action buttons removed as per user request */}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-8 max-w-5xl mx-auto w-full no-scrollbar">
          {!activeBlock ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <BookOpen className="w-16 h-16 mb-4" />
              <h2 className="text-xl font-bold">Selecciona o crea una situación</h2>
              <p>Comienza a planificar tu Situación de Aprendizaje.</p>
            </div>
          ) : !activeBlock.initialized ? (
            // Step 1: Initial configuration (Stage/Level)
            <div className="h-full flex flex-col items-center justify-center space-y-12 max-w-2xl mx-auto text-center">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold serif text-primary">Nueva Situación</h2>
                <p className="text-lg text-gray-500">Comencemos definiendo el nivel y la etapa educativa.</p>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-accent/5 border border-accent/10 w-full space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Etapa Educativa</label>
                    <div className="relative">
                      <select
                        value={activeBlock.stage}
                        onChange={(e) => handleStageChange(activeBlock.id, e.target.value)}
                        className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 font-bold text-primary appearance-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
                      >
                        {Object.keys(STAGE_LEVELS).map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Curso / Nivel</label>
                    <div className="relative">
                      <select
                        value={activeBlock.level}
                        onChange={(e) => handleLevelChange(activeBlock.id, e.target.value)}
                        className="w-full h-14 bg-gray-50 border border-gray-200 rounded-2xl px-5 font-bold text-primary appearance-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
                      >
                        {(STAGE_LEVELS[activeBlock.stage] || [activeBlock.level]).map(l => (
                          <option key={l}>{l}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <input
                    type="text"
                    value={activeBlock.title || ''}
                    onChange={(e) => updateBlock(activeBlock.id, { title: e.target.value })}
                    placeholder="Escribe un título (ej: El Valor de la Escucha)"
                    className="w-full h-14 border-b-2 border-gray-100 focus:border-primary transition-colors bg-transparent px-2 text-xl font-medium placeholder:text-gray-200 outline-none text-center"
                  />
                </div>

                <button
                  onClick={() => initializeCurriculum(activeBlock.id)}
                  className="w-full h-16 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-3"
                >
                  Continuar
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : activeBlock.step === 'planning' ? (
            <div className="max-w-4xl mx-auto space-y-12 py-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => updateBlock(activeBlock.id, { step: 'selection' })}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <h2 className="text-4xl font-bold serif text-primary">Aterrizaje y Metodología</h2>
                </div>
                <p className="text-gray-500 text-lg">Define qué vas a enseñar y cómo lo vas a hacer.</p>
              </div>

              {!activeBlock.plan ? (
                <div className="bg-white rounded-[2.5rem] p-12 border border-blue-50 shadow-xl shadow-blue-500/5 text-center space-y-8">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-10 h-10 text-blue-500" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">¿Generamos tu propuesta?</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Usaremos los elementos curriculares seleccionados y tus materiales para diseñar un itinerario de contenidos personalizado.
                    </p>
                  </div>

                  <div className="max-w-md mx-auto space-y-2 text-left">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Notas o instrucciones adicionales</label>
                    <textarea
                      value={activeBlock.planningNotes || ''}
                      onChange={(e) => updateBlock(activeBlock.id, { planningNotes: e.target.value })}
                      placeholder="Ej: Evita contenidos sobre X, céntrate más en Y, quiero que se mencione Z..."
                      className="w-full h-24 bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all text-sm outline-none resize-none"
                    />
                    <p className="text-[10px] text-gray-400 italic px-1">Indica si quieres abordar o evitar temas concretos para que la IA lo tenga en cuenta.</p>
                  </div>

                  <button
                    onClick={handleGeneratePlanning}
                    disabled={isAnalyzing || getSelectedCounts(activeBlock).critCount === 0}
                    className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all ${
                      isAnalyzing || getSelectedCounts(activeBlock).critCount === 0
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Generando propuesta...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6" />
                        <span>Generar Propuesta de Contenidos</span>
                    </>
                    )}
                  </button>
                  {getSelectedCounts(activeBlock).critCount === 0 && (
                    <p className="text-xs text-red-400 font-medium italic">Debes seleccionar al menos un criterio de evaluación en la pestaña anterior.</p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Content Proposal */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-lg">Propuesta de Contenidos</h3>
                      </div>
                      <button 
                        onClick={handleRegeneratePlanning}
                        className="text-gray-400 hover:text-purple-600 transition-colors"
                        title="Probar otra sugerencia"
                      >
                        <RotateCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 min-h-[400px]">
                      <div className="prose prose-sm max-w-none">
                        <AutoResizeTextArea
                          value={activeBlock.plan.suggestedContent || ''}
                          onChange={(e) => updateBlock(activeBlock.id, { 
                            plan: { ...activeBlock.plan!, suggestedContent: e.target.value } 
                          })}
                          className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Methodology and Settings */}
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-lg">Detalles Metodológicos</h3>
                      </div>
                      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contenido: ¿Qué tratar o evitar?</label>
                          <textarea
                            value={activeBlock.planningNotes || ''}
                            onChange={(e) => updateBlock(activeBlock.id, { planningNotes: e.target.value })}
                            placeholder="Ej: Evita contenidos sobre X, céntrate más en Y..."
                            className="w-full h-24 bg-gray-50 border border-transparent rounded-2xl p-4 focus:ring-2 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all text-sm outline-none resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Metodología: recursos y preferencias</label>
                          <textarea
                            value={activeBlock.plan.methodology || ''}
                            onChange={(e) => updateBlock(activeBlock.id, { 
                              plan: { ...activeBlock.plan!, methodology: e.target.value } 
                            })}
                            placeholder="Ej: Tengo tabletas para todos, pizarra digital, quiero trabajar por proyectos, actividades para hacer a mano..."
                            className="w-full h-32 bg-gray-50 border border-transparent rounded-2xl p-4 focus:ring-2 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all text-sm outline-none resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Número de Sesiones</label>
                          <div className="flex gap-2">
                            {[3, 4, 5, 6, 7, 8].map(num => (
                              <button
                                key={num}
                                onClick={() => updateBlock(activeBlock.id, { 
                                  plan: { ...activeBlock.plan!, numberOfActivities: num } 
                                })}
                                className={`flex-1 p-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${
                                  (activeBlock.plan?.numberOfActivities || 5) === num
                                    ? 'bg-primary border-primary text-white shadow-md'
                                    : 'bg-transparent border-gray-200 text-gray-400 hover:border-gray-300'
                                }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Modalidad Producto Final</label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => updateBlock(activeBlock.id, { 
                                plan: { ...activeBlock.plan!, finalProductMode: 'cumulative' } 
                              })}
                              className={`p-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${
                                activeBlock.plan?.finalProductMode === 'cumulative'
                                  ? 'bg-primary border-primary text-white shadow-md'
                                  : 'bg-transparent border-gray-200 text-gray-400 hover:border-gray-300'
                              }`}
                            >
                              Acumulativo
                            </button>
                            <button
                              onClick={() => updateBlock(activeBlock.id, { 
                                plan: { ...activeBlock.plan!, finalProductMode: 'compilatory' } 
                              })}
                              className={`p-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${
                                activeBlock.plan?.finalProductMode === 'compilatory'
                                  ? 'bg-primary border-primary text-white shadow-md'
                                  : 'bg-transparent border-gray-200 text-gray-400 hover:border-gray-300'
                              }`}
                            >
                              Compilatorio
                            </button>
                          </div>
                          <p className="text-[10px] text-gray-400 italic mt-2 px-1">
                            {activeBlock.plan?.finalProductMode === 'cumulative' 
                              ? "Suma de las tareas realizadas durante la situación." 
                              : "Una actividad nueva que sintetiza todo lo aprendido."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateSequencingAction}
                      disabled={isAnalyzing || !activeBlock.plan?.suggestedContent}
                      className={`w-full h-20 rounded-[2rem] font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
                        isAnalyzing || !activeBlock.plan?.suggestedContent
                          ? 'bg-gray-100 text-gray-400'
                          : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                      }`}
                    >
                      {isAnalyzing ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Workflow className="w-6 h-6" />
                      )}
                      <span>Generar secuenciación didáctica</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : activeBlock.step === 'sequencing' ? (
            <div className="max-w-4xl mx-auto space-y-12 py-8 pb-32">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => updateBlock(activeBlock.id, { step: 'planning' })}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <h2 className="text-4xl font-bold serif text-primary">Secuenciación Didáctica</h2>
                </div>
                <p className="text-gray-500 text-lg">Tu hoja de ruta para el aula paso a paso.</p>
              </div>

              <div className="space-y-8">
                {/* Justification Card */}
                {activeBlock.plan?.justification && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-purple-50/50 rounded-3xl border border-purple-100 p-8 space-y-3"
                  >
                    <div className="flex items-center gap-2 text-purple-600">
                      <Lightbulb className="w-5 h-5" />
                      <h3 className="font-bold uppercase text-[10px] tracking-widest">Justificación Pedagógica</h3>
                    </div>
                    <AutoResizeTextArea
                      value={activeBlock.plan.justification}
                      onChange={(e) => updateBlock(activeBlock.id, { 
                        plan: { ...activeBlock.plan!, justification: e.target.value } 
                      })}
                      className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm italic text-gray-700 leading-relaxed"
                    />
                  </motion.div>
                )}

                {/* Final Product Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-primary rounded-[2.5rem] p-10 text-white shadow-2xl shadow-primary/30 space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/10 px-3 py-2 rounded-xl backdrop-blur-md shrink-0 flex flex-col items-center justify-center min-w-[90px]">
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white leading-none text-center">Producto</span>
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white leading-none mt-1 text-center">Final</span>
                      </div>
                      <div className="flex-1">
                        <AutoResizeTextArea
                          value={activeBlock.plan?.finalProductTitle || activeBlock.plan?.finalProduct || ''}
                          onChange={(e) => updateBlock(activeBlock.id, { 
                            plan: { ...activeBlock.plan!, finalProductTitle: e.target.value } 
                          })}
                          className="bg-transparent border-none p-0 focus:ring-0 text-xl font-bold serif leading-tight text-white w-full placeholder:text-white/20 resize-none"
                          placeholder="Título del producto final..."
                        />
                        <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest mt-1">
                          {activeBlock.plan?.finalProductMode === 'cumulative' ? 'Propuesta Acumulativa' : 'Actividad de Síntesis'}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={handleRegenerateFinalProductAction}
                      disabled={isAnalyzing}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-2xl transition-all disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Sugiere un nuevo producto final y otras actividades</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Descripción</label>
                       <AutoResizeTextArea
                         value={activeBlock.plan?.finalProductDescription || activeBlock.plan?.finalProduct || ''}
                         onChange={(e) => updateBlock(activeBlock.id, { 
                           plan: { ...activeBlock.plan!, finalProductDescription: e.target.value } 
                         })}
                         className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white focus:ring-2 focus:ring-white/20 placeholder:text-white/30 resize-none min-h-[120px]"
                       />
                    </div>
                  </div>
                </motion.div>

                <div className="space-y-6">
                  {(activeBlock.activities || []).map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group"
                    >
                      <div className="flex p-8 gap-8">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex flex-col items-center justify-center text-primary shrink-0 border border-gray-100">
                          <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70">Actividad</span>
                          <span className="text-xl font-bold font-serif">{index + 1}</span>
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center justify-between">
                             <div className="flex-1 space-y-1">
                               <div className="flex items-center gap-2">
                                 <select
                                   value={activity.category || ''}
                                   onChange={(e) => {
                                     const newList = [...activeBlock.activities!];
                                     newList[index].category = e.target.value as any;
                                     updateBlock(activeBlock.id, { activities: newList });
                                   }}
                                   className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border transition-all cursor-pointer focus:ring-0 ${getCategoryColor(activity.category)}`}
                                 >
                                   <option value="" disabled>Selecciona tipo</option>
                                   <option value="motivación">Motivación</option>
                                   <option value="activación">Activación</option>
                                   <option value="exploración">Exploración</option>
                                   <option value="estructuración">Estructuración</option>
                                   <option value="aplicación">Aplicación</option>
                                   <option value="conclusión">Conclusión</option>
                                 </select>
                               </div>
                               <input
                                type="text"
                                value={activity.title}
                                onChange={(e) => {
                                  const newList = [...activeBlock.activities!];
                                  newList[index].title = e.target.value;
                                  updateBlock(activeBlock.id, { activities: newList });
                                }}
                                className="bg-transparent border-none p-0 focus:ring-0 font-bold text-xl text-gray-800 w-full"
                              />
                             </div>
                            <button 
                              onClick={() => handleRegenerateSpecificActivity(index)}
                              disabled={isGenerating === activity.id}
                              className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded-xl text-purple-600 transition-all disabled:opacity-50"
                            >
                              {isGenerating === activity.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Sparkles className="w-4 h-4" />
                                  <span className="text-[10px] font-bold uppercase tracking-widest">sugiere otra actividad</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Descripción</label>
                            <AutoResizeTextArea
                              value={activity.description}
                              onChange={(e) => {
                                const newList = [...activeBlock.activities!];
                                newList[index].description = e.target.value;
                                updateBlock(activeBlock.id, { activities: newList });
                              }}
                              className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm text-gray-600"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                 <Wrench className="w-3 h-3" /> Recursos
                               </label>
                               <AutoResizeTextArea
                                value={activity.resources}
                                onChange={(e) => {
                                  const newList = [...activeBlock.activities!];
                                  newList[index].resources = e.target.value;
                                  updateBlock(activeBlock.id, { activities: newList });
                                }}
                                className="w-full bg-transparent border-none p-0 focus:ring-0 text-[11px] text-gray-500 italic"
                              />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                 <Compass className="w-3 h-3" /> Metodología
                               </label>
                               <AutoResizeTextArea
                                value={activity.methodology || ''}
                                onChange={(e) => {
                                  const newList = [...activeBlock.activities!];
                                  newList[index].methodology = e.target.value;
                                  updateBlock(activeBlock.id, { activities: newList });
                                }}
                                className="w-full bg-transparent border-none p-0 focus:ring-0 text-[11px] text-gray-500 italic"
                                placeholder="Metodología específica..."
                              />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                 <BookText className="w-3 h-3" /> Ejercicios / Tareas
                               </label>
                               <AutoResizeTextArea
                                value={activity.exercises || ''}
                                onChange={(e) => {
                                  const newList = [...activeBlock.activities!];
                                  newList[index].exercises = e.target.value;
                                  updateBlock(activeBlock.id, { activities: newList });
                                }}
                                className="w-full bg-transparent border-none p-0 focus:ring-0 text-[11px] text-gray-500 italic"
                                placeholder="Actividades dentro de la sesión..."
                              />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                 <Target className="w-3 h-3" /> Evaluación (Criterios)
                               </label>
                               <AutoResizeTextArea
                                value={activity.criteria || ''}
                                onChange={(e) => {
                                  const newList = [...activeBlock.activities!];
                                  newList[index].criteria = e.target.value;
                                  updateBlock(activeBlock.id, { activities: newList });
                                }}
                                className="w-full bg-transparent border-none p-0 focus:ring-0 text-[11px] text-gray-500 italic"
                                placeholder="Criterios asociados..."
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <input
                              type="text"
                              value={activity.timing}
                              onChange={(e) => {
                                const newList = [...activeBlock.activities!];
                                newList[index].timing = e.target.value;
                                updateBlock(activeBlock.id, { activities: newList });
                              }}
                              className="text-[10px] font-bold uppercase text-gray-400 bg-transparent border-none p-0 focus:ring-0 w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center pt-8 border-t border-gray-100">
                <button
                  onClick={() => updateBlock(activeBlock.id, { step: 'evaluation' })}
                  className="px-8 py-3 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  Continuar a Evaluación <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : activeBlock.step === 'evaluation' ? (
            <div className="max-w-4xl mx-auto space-y-12 py-8 pb-32">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => updateBlock(activeBlock.id, { step: 'sequencing' })}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <h2 className="text-4xl font-bold serif text-primary">Instrumentos de Evaluación</h2>
                </div>
                <p className="text-gray-500 text-lg">Concreción de herramientas para valorar el aprendizaje.</p>
              </div>

              {!activeBlock.evaluation?.instruments || activeBlock.evaluation.instruments.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-12 text-center space-y-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                    <ClipboardList className="w-10 h-10 text-accent" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-primary">¿Cómo vamos a evaluar?</h3>
                    <p className="text-gray-500 max-w-md mx-auto">La IA analizará tus actividades y te propondrá los mejores instrumentos para cada una.</p>
                  </div>

                  <div className="max-w-md mx-auto space-y-2 text-left">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Preferencias de evaluación</label>
                    <textarea
                      value={activeBlock.evaluationNotes || ''}
                      onChange={(e) => updateBlock(activeBlock.id, { evaluationNotes: e.target.value })}
                      placeholder="Ej: Prefiero al menos una prueba escrita, trabajo en grupo, modalidad digital..."
                      className="w-full h-24 bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all text-sm outline-none resize-none"
                    />
                    <p className="text-[10px] text-gray-400 italic px-1">Indica si tienes preferencia por algún instrumento o modalidad concreta.</p>
                  </div>

                  <button
                    onClick={handleGenerateEvaluationAction}
                    disabled={isAnalyzing}
                    className="px-8 py-4 bg-accent text-white rounded-3xl font-bold text-lg hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 flex items-center gap-3 mx-auto"
                  >
                    {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                    <span>Diseñar Evaluación con IA</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeBlock.evaluation.instruments.map((inv, idx) => (
                      <motion.div
                        key={inv.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xl shadow-gray-200/30 flex flex-col gap-4 group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <input 
                              type="text"
                              value={inv.name}
                              onChange={(e) => {
                                const newInst = [...activeBlock.evaluation!.instruments];
                                newInst[idx].name = e.target.value;
                                updateBlock(activeBlock.id, { evaluation: { ...activeBlock.evaluation!, instruments: newInst } });
                              }}
                              className="w-full bg-transparent border-none p-0 focus:ring-0 font-bold text-lg text-primary"
                            />
                            <div className="flex gap-1 flex-wrap">
                              {inv.linkedActivitiesIds.map(actIdx => (
                                <span key={actIdx} className="text-[8px] font-bold bg-primary/5 text-primary/60 px-1.5 py-0.5 rounded uppercase">
                                  Act. {Number(actIdx) + 1}
                                </span>
                              ))}
                            </div>
                          </div>
                          <button 
                             onClick={() => {
                               const newInst = activeBlock.evaluation!.instruments.filter((_, i) => i !== idx);
                               updateBlock(activeBlock.id, { evaluation: { ...activeBlock.evaluation!, instruments: newInst } });
                             }}
                             className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <AutoResizeTextArea
                          value={inv.description}
                          onChange={(e) => {
                            const newInst = [...activeBlock.evaluation!.instruments];
                            newInst[idx].description = e.target.value;
                            updateBlock(activeBlock.id, { evaluation: { ...activeBlock.evaluation!, instruments: newInst } });
                          }}
                          className="text-sm text-gray-600 leading-relaxed bg-transparent border-none p-0 focus:ring-0"
                        />

                        {inv.canvaPrompt && (
                          <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between gap-3">
                            <div className="flex-1 overflow-hidden">
                              <p className="text-[9px] font-bold text-accent uppercase tracking-widest mb-1 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Exportar descripción a Canva
                              </p>
                              <p className="text-[10px] text-gray-400 truncate">{inv.canvaPrompt}</p>
                            </div>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(inv.canvaPrompt || '');
                                setCopiedId(inv.id);
                                setTimeout(() => setCopiedId(null), 2000);
                              }}
                              className="shrink-0 p-2 bg-gray-50 hover:bg-accent/10 hover:text-accent rounded-xl transition-all"
                              title="Copiar prompt para Canva"
                            >
                              {copiedId === inv.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                    
                    <button
                      onClick={() => {
                        const newInst = [...(activeBlock.evaluation?.instruments || []), {
                          id: `inst-new-${Date.now()}`,
                          name: 'Nuevo Instrumento',
                          description: 'Describe cómo vas a evaluar...',
                          linkedActivitiesIds: []
                        }];
                        updateBlock(activeBlock.id, { evaluation: { ...(activeBlock.evaluation || { instruments: [] }), instruments: newInst } });
                      }}
                      className="border-2 border-dashed border-gray-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-accent hover:text-accent transition-all"
                    >
                      <Plus className="w-8 h-8" />
                      <span className="font-bold text-xs uppercase tracking-widest">Añadir Instrumento</span>
                    </button>
                    <button
                      onClick={handleGenerateEvaluationAction}
                      disabled={isAnalyzing}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-accent border border-accent/20 rounded-xl hover:bg-accent/5 transition-all"
                    >
                      {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCw className="w-3 h-3" />}
                      Regenerar con IA
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-gray-200/30 space-y-4">
                      <div className="flex items-center gap-2 text-primary">
                        <PenTool className="w-5 h-5" />
                        <h3 className="font-bold uppercase text-[11px] tracking-widest">Tus preferencias</h3>
                      </div>
                      <textarea
                        value={activeBlock.evaluationNotes || ''}
                        onChange={(e) => updateBlock(activeBlock.id, { evaluationNotes: e.target.value })}
                        className="w-full text-sm text-gray-600 leading-relaxed bg-transparent border-none p-0 focus:ring-0 outline-none resize-none h-24"
                        placeholder="Pruebas escritas, trabajos digitales..."
                      />
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-gray-200/30 space-y-4">
                      <div className="flex items-center gap-2 text-primary">
                        <Target className="w-5 h-5" />
                      <h3 className="font-bold uppercase text-[11px] tracking-widest">Observaciones Generales de Evaluación</h3>
                    </div>
                    <AutoResizeTextArea
                      value={activeBlock.evaluation?.generalCriteria || ''}
                      onChange={(e) => updateBlock(activeBlock.id, { evaluation: { ...activeBlock.evaluation!, generalCriteria: e.target.value } })}
                      className="w-full text-sm text-gray-600 leading-relaxed bg-transparent border-none p-0 focus:ring-0"
                      placeholder="Indica criterios generales, porcentajes o ponderaciones si es necesario..."
                    />
                  </div>
                </div>

                <div className="flex justify-center pt-8">
                  <button
                    onClick={() => updateBlock(activeBlock.id, { step: 'diversity' })}
                    className="px-8 py-3 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                  >
                    Continuar a Diversidad <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              )}
            </div>
          ) : activeBlock.step === 'diversity' ? (
            <div className="max-w-4xl mx-auto space-y-12 py-8 pb-32">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => updateBlock(activeBlock.id, { step: 'evaluation' })}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <h2 className="text-4xl font-bold serif text-primary">Atención a la Diversidad</h2>
                </div>
                <p className="text-gray-500 text-lg">Personalizamos el aprendizaje para no dejar a nadie atrás.</p>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 space-y-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary">Necesidades del Aula</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Describe quién necesita apoyo especial</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <textarea 
                      placeholder="Ej: Un alumno con TEA con alta funcionalidad, dos alumnos con TDAH y una alumna con altas capacidades..."
                      value={activeBlock.diversity?.generalObservations || ''}
                      onChange={(e) => updateBlock(activeBlock.id, { diversity: { ...activeBlock.diversity!, generalObservations: e.target.value } })}
                      className="w-full h-32 p-6 bg-gray-50 rounded-3xl border-none focus:ring-2 focus:ring-primary/20 text-sm leading-relaxed"
                    />
                  </div>
                  
                  <button
                    onClick={() => handleGenerateDiversityAction(activeBlock.diversity?.generalObservations || '')}
                    disabled={isAnalyzing || !activeBlock.diversity?.generalObservations}
                    className="w-full py-4 bg-primary text-white rounded-3xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                  >
                    {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                    <span>Generar Medidas Específicas</span>
                  </button>
                </div>

                {activeBlock.diversity?.measures && activeBlock.diversity.measures.length > 0 && (
                  <div className="space-y-6 pt-6 border-t border-gray-50">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Propuestas de Intervención</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {activeBlock.diversity.measures.map((measure, idx) => (
                        <motion.div
                          key={measure.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col gap-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-primary text-[9px] font-bold text-white rounded-lg uppercase tracking-widest">
                                {measure.type}
                              </span>
                              <span className="text-[10px] font-bold text-gray-400 uppercase">
                                {measure.need}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-bold text-primary">Medida propuesta:</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{measure.measure}</p>
                          </div>
                          
                          <div className="p-4 bg-white/50 rounded-xl border border-white/50">
                            <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1 flex items-center gap-1">
                              <Compass className="w-3 h-3" /> Ajustes Metodológicos
                            </p>
                            <p className="text-xs text-gray-500 leading-relaxed italic">{measure.methodologyAdjustments}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center pt-8">
                <button
                  onClick={() => handleExport()}
                  disabled={isExporting}
                  className="px-12 py-4 bg-primary text-white rounded-[2rem] font-bold text-xl hover:scale-105 transition-all shadow-2xl shadow-primary/30 flex items-center gap-3"
                >
                  <Download className="w-6 h-6" />
                  <span>Finalizar y Exportar SdA</span>
                </button>
              </div>
            </div>
          ) : activeBlock.step === 'selection' ? (
            <motion.div
              key={activeBlock.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12 pb-24"
            >
              {/* Materials Section Integrated */}
              <section className="bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-500/5 overflow-hidden">
                <div className="p-6 border-b border-blue-50 bg-blue-50/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <div>
                      <h3 className="font-bold text-blue-900">Tus Materiales e Ideas</h3>
                      <p className="text-[10px] text-blue-600 font-medium uppercase tracking-widest">Punto de partida y guía para la IA</p>
                    </div>
                  </div>
                  <button
                    onClick={handleAnalyzeContent}
                    disabled={isAnalyzing || !activeBlock.materials}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${
                      isAnalyzing || !activeBlock.materials
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20'
                    }`}
                  >
                    {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    Sincronizar Currículo
                  </button>
                </div>
                <div className="p-6">
                  <AutoResizeTextArea
                    value={activeBlock.materials || ''}
                    onChange={(e) => updateBlock(activeBlock.id, { materials: e.target.value })}
                    placeholder="Escribe aquí tus ideas, describe tus materiales o lo que quieres conseguir. La IA lo usará para sugerirte el mejor currículo y diseñar la propuesta."
                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm text-gray-700 min-h-[80px]"
                  />
                  <div className="mt-4 pt-4 border-t border-blue-50 flex items-center justify-between">
                     <p className="text-[10px] text-gray-400 italic">Los cambios en este texto influirán en las sugerencias de las siguientes pestañas.</p>
                  </div>
                </div>
              </section>

              {/* Section: Competencias and Criterios */}
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight serif">Competencias y Criterios</h2>
                    <p className="text-sm text-gray-500">Selecciona los elementos que trabajarás en esta situación.</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {activeBlock.competenciasEspecíficas.map(ce => (
                    <div key={ce.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="p-5 border-b border-gray-50 flex items-start gap-4">
                        <div className="mt-1 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                          CE
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-lg leading-snug text-gray-800">
                            {ce.description}
                          </p>
                        </div>
                      </div>

                      <div className="p-1">
                        {ce.criteriosEvaluación.map(crit => (
                          <div 
                            key={crit.id} 
                            onClick={() => toggleElementSelection(activeBlock.id, 'criterio', ce.id, crit.id)}
                            className={`group flex items-start gap-4 p-4 transition-all rounded-xl mx-2 mb-1 cursor-pointer border ${
                              crit.selected 
                                ? 'bg-blue-50/50 border-blue-200 shadow-sm' 
                                : 'hover:bg-gray-50 border-transparent'
                            }`}
                          >
                            <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 border transition-all ${
                              crit.selected 
                                ? 'bg-blue-500 text-white border-blue-600' 
                                : 'bg-blue-50 text-blue-400 border-blue-100'
                            }`}>
                              {crit.selected ? <Check className="w-4 h-4" /> : 'CrEv'}
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className={`text-sm font-semibold leading-relaxed transition-colors ${
                                crit.selected ? 'text-blue-900' : 'text-gray-700'
                              }`}>
                                {crit.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section: Saberes Básicos */}
              <section className="space-y-6 pt-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight serif">Saberes Básicos</h2>
                    <p className="text-sm text-gray-500">Selecciona los contenidos fundamentales a tratar.</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {Array.from(new Set(activeBlock.saberesBásicos.map(s => s.category))).map(category => (
                    <div key={category} className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary bg-primary/5 px-4 py-2 rounded-lg border-l-4 border-primary">
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4 border-l border-gray-100">
                        {activeBlock.saberesBásicos.filter(s => s.category === category).map(sb => (
                          <div 
                            key={sb.id} 
                            onClick={() => toggleElementSelection(activeBlock.id, 'saber', '', sb.id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 ${
                              sb.selected 
                                ? 'bg-amber-50 border-amber-200 shadow-sm' 
                                : 'bg-white border-gray-100 hover:border-gray-300'
                            }`}
                          >
                            <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 border transition-all ${
                              sb.selected 
                                ? 'bg-amber-500 text-white border-amber-600' 
                                : 'bg-amber-50 text-amber-500 border-amber-100'
                            }`}>
                              {sb.selected ? <Check className="w-3 h-3" /> : 'SaBa'}
                            </div>
                            <p className={`text-xs font-semibold leading-relaxed ${
                              sb.selected ? 'text-amber-900' : 'text-gray-800'
                            }`}>
                              {sb.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Navigation button at the bottom */}
              <div className="flex flex-col items-center gap-4 pt-12 pb-8 border-t border-gray-100">
                <button
                  onClick={() => setStep('planning')}
                  disabled={getSelectedCounts(activeBlock).critCount === 0}
                  className={`flex items-center gap-3 px-12 py-6 rounded-3xl font-bold text-xl shadow-2xl transition-all ${
                    getSelectedCounts(activeBlock).critCount === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary/90 shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  <Target className="w-6 h-6" />
                  <span>Diseñar propuesta de contenidos</span>
                </button>
                {getSelectedCounts(activeBlock).critCount === 0 && (
                  <p className="text-sm text-red-500 font-medium animate-pulse">Debes seleccionar al menos un criterio de evaluación para continuar.</p>
                )}
              </div>
            </motion.div>
          ) : null}
        </div>
      </main>
    </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmation(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 pb-6 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold serif text-gray-900 mb-2">¿Eliminar situación?</h3>
                <p className="text-gray-500 leading-relaxed">
                  Estás a punto de borrar definitivamente <span className="font-bold text-gray-800">"{blocks.find(b => b.id === deleteConfirmation)?.title || 'esta situación'}"</span>. 
                  Esta acción es irreversible y perderás todos los contenidos generados.
                </p>
              </div>
              <div className="flex p-4 gap-3">
                <button
                  onClick={() => setDeleteConfirmation(null)}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all font-bold"
                >
                  Sí, eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Export Tool Modal */}
      <AnimatePresence>
        {exportContent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExportContent(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 pb-4 flex items-center justify-between border-b border-gray-100">
                <div>
                  <h3 className="text-2xl font-bold serif text-gray-900">Contenido para exportar</h3>
                  <p className="text-sm text-gray-500">Copia este texto y pégalo en tu procesador de textos favorito</p>
                </div>
                <button 
                  onClick={() => setExportContent(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                    {exportContent}
                  </pre>
                </div>
              </div>

              <div className="p-6 pt-2 flex gap-3">
                <button
                  onClick={() => setExportContent(null)}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(exportContent);
                    alert("¡Contenido copiado al portapapeles!");
                  }}
                  className="flex-[2] py-4 bg-indigo-500 text-white font-bold rounded-2xl hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Copy className="w-5 h-5" />
                  Copiar al portapapeles
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Info Mobile Only or floating */}
      <div className="md:hidden p-4 bg-white border-t border-gray-200">
        <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest">Kerygma APP</p>
      </div>
    </div>
  );
}
