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
  Github,
  Cloud,
  Star,
  CheckCircle2,
  Info,
  Search,
  MapPin,
  Package,
  Users2,
  ClipboardCheck,
  RefreshCcw,
  RefreshCw,
  ShieldAlert,
  Eye,
  Settings2
} from 'lucide-react';
import { CurriculumBlock, Competencia, SaberBásico, Criterio, Activity, UnitPlan, EvaluationInstrument, StudentGroup } from './types';
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  SABERES_ESO_3_4,
  CRITERIOS_BACHILLERATO_1,
  CRITERIOS_BACHILLERATO_2
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
  improveInstrument,
  generateDiversityMeasures,
  generateDocenteReflection,
  isAIConfigured,
  getInstrumentManualPrompt
} from './services/geminiService';
import ReactMarkdown from 'react-markdown';
import { useAuth } from './lib/AuthContext';
import { db } from './lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  setDoc, 
  getDocs,
  addDoc,
  doc, 
  deleteDoc,
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';

const GOOGLE_MAPS_API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidMapsKey = Boolean(GOOGLE_MAPS_API_KEY) && GOOGLE_MAPS_API_KEY !== 'YOUR_API_KEY';

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
          <p className="text-base md:text-lg font-medium text-gray-500 max-w-lg">
            Planificador de Situaciones de Aprendizaje<br />
            de Religión Católica para Andalucía
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


const SchoolSearchInput = ({ onSchoolSelect, initialValue }: { onSchoolSelect: (data: { name: string, municipality?: string, province?: string, address?: string, placeId?: string }) => void, initialValue?: string }) => {
  const [inputValue, setInputValue] = useState(initialValue || '');
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['address_components', 'geometry', 'name', 'formatted_address', 'place_id'],
      componentRestrictions: { country: 'es' },
      types: ['school', 'establishment']
    };

    setAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!autocomplete) return;

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place || !place.name) return;

      let municipality = '';
      let province = '';
      let address = place.formatted_address || '';

      if (place.address_components) {
        for (const component of place.address_components) {
          if (component.types.includes('locality') || component.types.includes('administrative_area_level_3')) {
            municipality = component.long_name;
          }
          if (component.types.includes('administrative_area_level_2')) {
            province = component.long_name;
          }
        }
      }

      onSchoolSelect({
        name: place.name,
        municipality,
        province,
        address,
        placeId: place.place_id
      });
      setInputValue(place.name);
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [autocomplete, onSchoolSelect]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        className="w-full h-[52px] p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 outline-none pr-12 placeholder:text-gray-400"
        placeholder="Nombre o dirección del centro..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <Search className="w-5 h-5 text-gray-300" />
      </div>
    </div>
  );
};

const AddGroupModal = ({ isOpen, onClose, onSave, existingSchools, editingGroup }: { isOpen: boolean, onClose: () => void, onSave: (group: Omit<StudentGroup, 'id' | 'userId'>) => void, existingSchools: string[], editingGroup?: StudentGroup | null }) => {
  const [stage, setStage] = useState<'Infantil' | 'Primaria' | 'Secundaria' | 'Bachillerato'>('Primaria');
  const [course, setCourse] = useState('');
  const [letter, setLetter] = useState('');
  const [school, setSchool] = useState('');
  const [newSchoolName, setNewSchoolName] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [province, setProvince] = useState('');
  const [address, setAddress] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [isAddingNewSchool, setIsAddingNewSchool] = useState(false);
  const [isLocatingSchool, setIsLocatingSchool] = useState(false);
  const [studentDescription, setStudentDescription] = useState('');
  const [needsDescription, setNeedsDescription] = useState('');

  // Initial population for editing
  useEffect(() => {
    if (editingGroup) {
      setStage(editingGroup.stage || 'Primaria');
      setCourse(editingGroup.course);
      setLetter(editingGroup.letter);
      setSchool(editingGroup.school);
      setMunicipality(editingGroup.municipality || '');
      setProvince(editingGroup.province || '');
      setAddress(editingGroup.address || '');
      setPlaceId(editingGroup.placeId || '');
      setStudentDescription(editingGroup.studentDescription);
      setNeedsDescription(editingGroup.needsDescription);
      setIsAddingNewSchool(false);
      setIsLocatingSchool(false);
    } else {
      // Reset if not editing
      setStage('Primaria');
      setCourse('');
      setLetter('');
      setSchool('');
      setNewSchoolName('');
      setMunicipality('');
      setProvince('');
      setAddress('');
      setPlaceId('');
      setIsAddingNewSchool(false);
      setIsLocatingSchool(false);
      setStudentDescription('');
      setNeedsDescription('');
    }
  }, [editingGroup, isOpen]);

  // Update selected course when stage changes if the current course doesn't match the new stage
  useEffect(() => {
    const levels = STAGE_LEVELS[stage] || [];
    if (!levels.includes(course)) {
      setCourse(levels[0] || '');
    }
  }, [stage]);

  if (!isOpen) return null;

  const handleSave = () => {
    const finalSchool = isAddingNewSchool ? newSchoolName : school;
    if (!finalSchool || !course) return;
    onSave({ 
      course, 
      letter, 
      school: finalSchool, 
      stage,
      studentDescription, 
      needsDescription,
      municipality,
      province,
      address,
      placeId
    });
    // Reset fields
    setCourse('');
    setLetter('');
    setSchool('');
    setNewSchoolName('');
    setMunicipality('');
    setProvince('');
    setAddress('');
    setPlaceId('');
    setIsAddingNewSchool(false);
    setIsLocatingSchool(false);
    setStudentDescription('');
    setNeedsDescription('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2.5rem] p-10 w-full max-w-lg space-y-8 shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="space-y-2 shrink-0">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-3">
            <Users className="w-6 h-6 text-accent" />
            {editingGroup ? 'Editar grupo' : 'Nuevo grupo de alumnos'}
          </h2>
          <p className="text-gray-400 text-sm">Configura los detalles del grupo para personalizar sus SdA.</p>
        </div>

        <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
          {/* CENTRO */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Centro Educativo</label>
            {!isAddingNewSchool ? (
              <div className="flex gap-2">
                <select 
                  className="flex-1 p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 outline-none" 
                  value={school} 
                  onChange={e => {
                    if (e.target.value === 'ADD_NEW') {
                      setIsAddingNewSchool(true);
                      setIsLocatingSchool(false);
                    } else {
                      setSchool(e.target.value);
                      // Clear other fields when selecting an existing school
                      setMunicipality('');
                      setProvince('');
                      setAddress('');
                    }
                  }}
                >
                  <option value="">Selecciona un centro...</option>
                  {existingSchools.map(s => <option key={s} value={s}>{s}</option>)}
                  <option value="ADD_NEW" className="text-primary font-bold">+ Registrar nuevo centro...</option>
                </select>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest italic">{isLocatingSchool ? 'Buscador Maps' : 'Nombre Manual'}</p>
                  <button 
                    onClick={() => setIsLocatingSchool(!isLocatingSchool)}
                    className="text-[10px] font-bold text-accent hover:underline uppercase tracking-widest flex items-center gap-1"
                  >
                    {isLocatingSchool ? <Edit2 className="w-3 h-3" /> : <Search className="w-3 h-3" />}
                    {isLocatingSchool ? 'Escribir a mano' : 'Buscar online'}
                  </button>
                </div>
                
                {isLocatingSchool ? (
                  <SchoolSearchInput 
                    onSchoolSelect={(data) => {
                      setNewSchoolName(data.name);
                      setMunicipality(data.municipality || '');
                      setProvince(data.province || '');
                      setAddress(data.address || '');
                      setPlaceId(data.placeId || '');
                    }} 
                    initialValue={newSchoolName}
                  />
                ) : (
                  <div className="flex gap-2">
                    <input 
                      autoFocus
                      className="flex-1 p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 outline-none" 
                      placeholder="Nombre del centro" 
                      value={newSchoolName} 
                      onChange={e => setNewSchoolName(e.target.value)} 
                    />
                  </div>
                )}

                {(municipality || province) && (
                  <div className="p-3 bg-gray-50 rounded-2xl flex items-start gap-2 border border-gray-100">
                    <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <div className="text-[11px] text-gray-500">
                      <span className="font-bold text-gray-700">{municipality}</span> {province && `(${province})`}
                      {address && <p className="mt-0.5 opacity-70 line-clamp-1">{address}</p>}
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={() => {
                    setIsAddingNewSchool(false);
                    setIsLocatingSchool(false);
                    setNewSchoolName('');
                    setMunicipality('');
                    setProvince('');
                    setAddress('');
                  }}
                  className="w-full py-2 text-[10px] font-bold text-gray-400 hover:text-primary uppercase tracking-widest text-center"
                >
                  Volver al listado
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* ETAPA */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Etapa</label>
              <select 
                className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 outline-none" 
                value={stage} 
                onChange={e => setStage(e.target.value as any)}
              >
                {Object.keys(STAGE_LEVELS).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* CURSO */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Curso</label>
              <select 
                className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 outline-none" 
                value={course} 
                onChange={e => setCourse(e.target.value)}
              >
                {(STAGE_LEVELS[stage] || []).map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* LETRA */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Letra / Sección</label>
              <input className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 outline-none" placeholder="Ej: A, B, C..." value={letter} onChange={e => setLetter(e.target.value)} />
            </div>
          </div>

          {/* DESCRIPCIONES */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Perfil del Alumnado</label>
              <textarea className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 outline-none h-24 resize-none" placeholder="Describe brevemente el grupo..." value={studentDescription} onChange={e => setStudentDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Necesidades Específicas</label>
              <textarea className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 outline-none h-24 resize-none" placeholder="Indica si hay alumnos con necesidades de apoyo..." value={needsDescription} onChange={e => setNeedsDescription(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4 shrink-0">
          <button onClick={onClose} className="flex-1 py-4 text-sm font-bold text-gray-400 hover:bg-gray-50 rounded-2xl transition-all">Cancelar</button>
          <button 
            onClick={handleSave} 
            disabled={(!school && !newSchoolName) || !course}
            className="flex-[2] py-4 text-sm font-bold bg-primary text-white rounded-2xl hover:bg-primary/90 disabled:opacity-50 transition-all shadow-xl shadow-primary/20"
          >
            {editingGroup ? 'Guardar Cambios' : 'Crear Grupo'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const { user, login, logout, loading, isFirebaseEnabled } = useAuth();
  const [blocks, setBlocks] = useState<CurriculumBlock[]>(() => {
    const saved = localStorage.getItem('kerygma_blocks');
    return saved ? JSON.parse(saved) : DEFAULT_CURRICULUM;
  });

  const [studentGroups, setStudentGroups] = useState<StudentGroup[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  
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
  const [viewSelection, setViewSelection] = useState<{ stage: CurriculumBlock['stage']; level: string } | null>(null);
  const [activeBlockId, setActiveBlockId] = useState<string>('');
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const syncTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportContent, setExportContent] = useState<string | null>(null);
  const [exportingBlock, setExportingBlock] = useState<CurriculumBlock | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [editingInstrument, setEditingInstrument] = useState<EvaluationInstrument | null>(null);
  const [isImprovingInstrument, setIsImprovingInstrument] = useState(false);
  const [isEditingPlanning, setIsEditingPlanning] = useState(false);
  const tokenRef = useRef<string | null>(null);

  const handleSaveGroup = async (newGroup: Omit<StudentGroup, 'id' | 'userId'>) => {
    if (!user || !db) return;
    try {
      if (editingGroupId) {
        await setDoc(doc(db, 'studentGroups', editingGroupId), {
          ...newGroup,
          userId: user.uid
        }, { merge: true });
        setEditingGroupId(null);
      } else {
        await addDoc(collection(db, 'studentGroups'), {
          ...newGroup,
          userId: user.uid
        });
      }
      setShowAddGroupModal(false);
    } catch (error) {
      console.error("Error saving group:", error);
      handleFirestoreError(error, editingGroupId ? OperationType.UPDATE : OperationType.CREATE, 'studentGroups');
    }
  };

  const handleExport = (blockToExport?: CurriculumBlock) => {
    const targetBlock = blockToExport || activeBlock;
    if (!targetBlock) return;
    
    if (!targetBlock.activities || targetBlock.activities.length === 0) {
      alert("Debes completar la situación de aprendizaje hasta el paso de Secuenciación para exportar.");
      return;
    }
    
    const content = generateMarkdownContent(targetBlock);
    setExportingBlock(targetBlock);
    setExportContent(content);
  };

  const formatLevelPDF = (level: string, stage: string) => {
    if (stage === 'Infantil') return `${level} AÑOS`;
    if (stage === 'Bachillerato') return `${level} BACH`;
    return `${level} ${stage.toUpperCase()}`;
  };

  const handleExportPDF = (blockToExport?: CurriculumBlock) => {
    const targetBlock = blockToExport || activeBlock;
    if (!targetBlock) return;

    if (!targetBlock.activities || targetBlock.activities.length === 0) {
      alert("Debes completar la situación de aprendizaje hasta el paso de Secuenciación para exportar.");
      return;
    }

    try {
      const doc = new jsPDF();
      const title = targetBlock.title || 'Situación de Aprendizaje';
      const subtitle = `Religión Católica - ${formatLevelPDF(targetBlock.level, targetBlock.stage)}`;
      
      // Configure fonts
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(30, 41, 59); // gray-800
      doc.text("KERYGMA APP", 105, 15, { align: 'center' });
      
      doc.setFontSize(16);
      doc.text(title.toUpperCase(), 105, 25, { align: 'center' });
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(100, 116, 139); // gray-500
      doc.text(subtitle, 105, 32, { align: 'center' });
      
      doc.setDrawColor(226, 232, 240); // gray-200
      doc.line(20, 38, 190, 38);

      let currentY = 48;

      // 1. CONTEXTUALIZACIÓN
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text("1. CONTEXTUALIZACIÓN Y JUSTIFICACIÓN", 20, currentY);
      currentY += 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const justification = targetBlock.plan?.justification || "No se ha proporcionado justificación.";
      const splitJust = doc.splitTextToSize(justification, 170);
      doc.text(splitJust, 20, currentY);
      currentY += (splitJust.length * 5) + 10;

      // 2. COMPETENCIAS Y CRITERIOS
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("2. COMPETENCIAS ESPECÍFICAS Y CRITERIOS DE EVALUACIÓN", 20, currentY);
      currentY += 8;

      const compData: any[][] = [];
      targetBlock.competenciasEspecíficas.forEach(ce => {
        const selectedCrits = ce.criteriosEvaluación.filter(c => c.selected);
        if (selectedCrits.length > 0) {
          const compText = ce.description.replace(/\s+/g, ' ').trim();
          
          const critText = selectedCrits.map(c => c.description.replace(/\s+/g, ' ').trim()).join('\n\n');

          compData.push([compText, critText]);
        }
      });

      autoTable(doc, {
        startY: currentY,
        head: [['COMPETENCIA ESPECÍFICA', 'CRITERIOS DE EVALUACIÓN']],
        body: compData,
        theme: 'grid',
        margin: { left: 20, right: 20 },
        headStyles: { 
          fillColor: [79, 70, 229], 
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: { 
          fontSize: 8, 
          cellPadding: 4,
          valign: 'top',
          halign: 'left',
          lineColor: [226, 232, 240],
          lineWidth: 0.1,
          overflow: 'linebreak'
        },
        columnStyles: { 
          0: { cellWidth: 55, fontStyle: 'bold' }, 
          1: { cellWidth: 115 } 
        }
      });

      currentY = (doc as any).lastAutoTable.finalY + 15;

      // 3. SABERES BÁSICOS
      if (currentY > 240) { doc.addPage(); currentY = 20; }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("3. SABERES BÁSICOS", 20, currentY);
      currentY += 8;

      const saberesData: any[][] = [];
      const selectedSaberes = targetBlock.saberesBásicos.filter(s => s.selected);
      selectedSaberes.forEach(s => {
        saberesData.push([s.category, s.description.replace(/\s+/g, ' ').trim()]);
      });

      autoTable(doc, {
        startY: currentY,
        head: [['BLOQUE / CATEGORÍA', 'SABER BÁSICO']],
        body: saberesData,
        theme: 'grid',
        margin: { left: 20, right: 20 },
        headStyles: { 
          fillColor: [16, 185, 129], 
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: { 
          fontSize: 8, 
          cellPadding: 4,
          valign: 'top',
          halign: 'left',
          lineColor: [226, 232, 240],
          lineWidth: 0.1,
          overflow: 'linebreak'
        },
        columnStyles: { 
          0: { cellWidth: 50, fontStyle: 'bold' }, 
          1: { cellWidth: 120 } 
        }
      });

      currentY = (doc as any).lastAutoTable.finalY + 15;

      // 4. SECUENCIACIÓN DIDÁCTICA
      if (currentY > 220) { doc.addPage(); currentY = 20; }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("4. SECUENCIACIÓN DE ACTIVIDADES", 20, currentY);
      currentY += 8;

      const actData: any[][] = [];
      targetBlock.activities?.forEach((act, idx) => {
        actData.push([
          `${idx + 1}. ${act.title}\n(${act.category?.toUpperCase() || ''})`,
          `DESCRIPCIÓN: ${act.description}\n\n` +
          `TAREAS/EJERCICIOS: ${act.exercises || 'No especificados'}\n\n` +
          `METODOLOGÍA: ${act.methodology || 'No especificada'}\n\n` +
          `EVALUACIÓN (CRITERIOS): ${act.criteria || 'Sin vincular'}\n\n` +
          `RECURSOS: ${act.resources}\n` +
          `TIEMPO: ${act.timing}`
        ]);
      });

      autoTable(doc, {
        startY: currentY,
        head: [['ACTIVIDAD', 'DESARROLLO, EVALUACIÓN Y RECURSOS']],
        body: actData,
        theme: 'grid',
        margin: { left: 20, right: 20 },
        headStyles: { 
          fillColor: [244, 63, 94], 
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: { 
          fontSize: 8, 
          cellPadding: 4,
          valign: 'top',
          halign: 'left',
          lineColor: [226, 232, 240],
          lineWidth: 0.1,
          overflow: 'linebreak'
        },
        columnStyles: { 
          0: { cellWidth: 45, fontStyle: 'bold' }, 
          1: { cellWidth: 125 } 
        }
      });

      currentY = (doc as any).lastAutoTable.finalY + 15;

      // 5. PRODUCTO FINAL Y EVALUACIÓN
      if (currentY > 220) { doc.addPage(); currentY = 20; }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("5. PRODUCTO FINAL Y EVALUACIÓN", 20, currentY);
      currentY += 8;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(`Producto Final: ${targetBlock.plan?.finalProductTitle || 'Sin título'}`, 20, currentY);
      currentY += 5;
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.text(`Modalidad: ${targetBlock.plan?.finalProductMode === 'cumulative' ? 'Acumulativo' : 'Recopilatorio'}`, 20, currentY);
      currentY += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const prodDesc = targetBlock.plan?.finalProductDescription || "";
      const splitProd = doc.splitTextToSize(prodDesc, 170);
      doc.text(splitProd, 20, currentY);
      currentY += (splitProd.length * 5) + 8;

      const instData: any[][] = [];
      targetBlock.evaluation?.instruments.forEach(inst => {
        instData.push([inst.name, inst.description]);
      });

      if (instData.length > 0) {
          autoTable(doc, {
            startY: currentY,
            head: [['INSTRUMENTO DE EVALUACIÓN', 'DESCRIPCIÓN']],
            body: instData,
            theme: 'grid',
            margin: { left: 20, right: 20 },
            headStyles: { 
              fillColor: [59, 130, 246], 
              textColor: 255,
              fontStyle: 'bold',
              halign: 'center'
            },
            styles: { 
              fontSize: 8, 
              cellPadding: 4,
              valign: 'top',
              halign: 'left',
              lineColor: [226, 232, 240],
              lineWidth: 0.1,
              overflow: 'linebreak'
            },
            columnStyles: { 
              0: { cellWidth: 50, fontStyle: 'bold' },
              1: { cellWidth: 'auto' }
            }
          });
        currentY = (doc as any).lastAutoTable.finalY + 15;
      }

      // 6. ATENCIÓN A LA DIVERSIDAD
      if (targetBlock.diversity && targetBlock.diversity.measures.length > 0) {
        if (currentY > 220) { doc.addPage(); currentY = 20; }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("6. ATENCIÓN A LA DIVERSIDAD", 20, currentY);
        currentY += 8;

        const divData: any[][] = [];
        targetBlock.diversity.measures.forEach(m => {
          divData.push([m.type, m.need, m.measure]);
        });

        autoTable(doc, {
          startY: currentY,
          head: [['TIPO', 'NECESIDAD', 'MEDIDA SUGERIDA']],
          body: divData,
          theme: 'grid',
          margin: { left: 20, right: 20 },
          headStyles: { 
            fillColor: [168, 85, 247], 
            textColor: 255,
            fontStyle: 'bold',
            halign: 'center'
          },
          styles: { 
            fontSize: 8, 
            cellPadding: 4,
            valign: 'top',
            halign: 'left',
            lineColor: [226, 232, 240],
            lineWidth: 0.1,
            overflow: 'linebreak'
          },
          columnStyles: { 
            0: { cellWidth: 35, fontStyle: 'bold' },
            1: { cellWidth: 45 },
            2: { cellWidth: 'auto' }
          }
        });
        currentY = (doc as any).lastAutoTable.finalY + 15;
      }

      // 7. EVALUACIÓN DE LA PRÁCTICA DOCENTE
      if (targetBlock.docenteEval) {
        if (currentY > 220) { doc.addPage(); currentY = 20; }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("7. EVALUACIÓN DE LA PRÁCTICA DOCENTE", 20, currentY);
        currentY += 8;

        const evalFields = [
          { field: 'materiaResults', label: 'Resultados de la materia' },
          { field: 'metodosPedagogicos', label: 'Métodos didácticos' },
          { field: 'materialesRecursos', label: 'Materiales y Recursos' },
          { field: 'eficaciaDiversidad', label: 'Atención a la diversidad' },
          { field: 'instrumentosVariedad', label: 'Instrumentos de evaluación' }
        ];

        const evalData: any[][] = [];
        evalFields.forEach(f => {
          const isSelected = targetBlock.docenteEval?.selectedCategories?.includes(f.field) ?? false;
          const questions = targetBlock.docenteEval?.reflectionQuestions?.[f.field];
          if (isSelected && questions && questions.length > 0) {
            evalData.push([f.label, questions.join('\n\n')]);
          }
        });

        if (evalData.length > 0) {
          autoTable(doc, {
            startY: currentY,
            head: [['ÁREA DE REFLEXIÓN', 'GUÍA DE PREGUNTAS PARA LA REFLEXIÓN']],
            body: evalData,
            theme: 'grid',
            margin: { left: 20, right: 20 },
            headStyles: { 
              fillColor: [30, 41, 59], 
              textColor: 255,
              fontStyle: 'bold',
              halign: 'center'
            },
            styles: { 
              fontSize: 8, 
              cellPadding: 4,
              valign: 'top',
              halign: 'left',
              lineColor: [226, 232, 240],
              lineWidth: 0.1,
              overflow: 'linebreak'
            },
            columnStyles: { 
              0: { cellWidth: 50, fontStyle: 'bold' },
              1: { cellWidth: 'auto' }
            }
          });
        } else {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(10);
          doc.text("No se han registrado reflexiones sobre la práctica docente.", 20, currentY);
        }
      }

      // 8. ANEXOS: INSTRUMENTOS DE EVALUACIÓN DETALLADOS
      const detailedInstruments = targetBlock.evaluation?.instruments.filter(i => i.content);
      if (detailedInstruments && detailedInstruments.length > 0) {
        doc.addPage();
        currentY = 20;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("ANEXOS: INSTRUMENTOS DE EVALUACIÓN", 20, currentY);
        currentY += 15;

        detailedInstruments.forEach((inv, i) => {
          if (currentY > 240) { doc.addPage(); currentY = 20; }
          
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text(`${i + 1}. ${inv.name} (${inv.type || 'Instrumento'})`, 20, currentY);
          currentY += 8;

          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          const descLines = doc.splitTextToSize(inv.description, 170);
          doc.text(descLines, 20, currentY);
          currentY += (descLines.length * 5) + 8;

          // Render content based on type
          if (inv.type === 'Rúbrica' && inv.content?.rows) {
            autoTable(doc, {
              startY: currentY,
              head: [['CRITERIO', ...(inv.content.headers || [])]],
              body: inv.content.rows.map((r: any) => [r.criteria, ...(r.cells || [])]),
              theme: 'grid',
              styles: { fontSize: 7, cellPadding: 2 },
              headStyles: { fillColor: [71, 85, 105] }
            });
            currentY = (doc as any).lastAutoTable.finalY + 15;
          } else if (inv.type === 'Lista de Cotejo' && inv.content?.items) {
            autoTable(doc, {
              startY: currentY,
              head: [['INDICADOR DE LOGRO', 'SÍ/NO/OBS']],
              body: inv.content.items.map((it: any) => [it, '']),
              theme: 'grid',
              styles: { fontSize: 8 },
              columnStyles: { 1: { cellWidth: 40 } }
            });
            currentY = (doc as any).lastAutoTable.finalY + 15;
          } else if (inv.type === 'Prueba Escrita' && inv.content?.questions) {
            inv.content.questions.forEach((q: any, qIdx: number) => {
              if (currentY > 260) { doc.addPage(); currentY = 20; }
              doc.setFont("helvetica", "bold");
              doc.text(`${qIdx + 1}. ${q.question}`, 20, currentY);
              currentY += 6;
              if (q.options) {
                q.options.forEach((opt: string) => {
                  doc.setFont("helvetica", "normal");
                  doc.text(`[ ] ${opt}`, 25, currentY);
                  currentY += 5;
                });
              } else {
                currentY += 10; // Espacio para respuesta
              }
              currentY += 5;
            });
            currentY += 10;
          } else if (inv.type === 'Escala de Valoración' && inv.content?.items) {
            autoTable(doc, {
              startY: currentY,
              head: [['ÍTEM', ...(inv.content.scale || [])]],
              body: inv.content.items.map((it: any) => [it, ...(inv.content.scale || []).map(() => '')]),
              theme: 'grid',
              styles: { fontSize: 8 }
            });
            currentY = (doc as any).lastAutoTable.finalY + 15;
          } else if (inv.type === 'Diana de Autoevaluación' && inv.content?.indicators) {
            autoTable(doc, {
              startY: currentY,
              head: [['INDICADOR / ÁREA DE MEJORA', '1', '2', '3', '4', '5'].slice(0, (inv.content.levels || 4) + 1)],
              body: inv.content.indicators.map((it: any) => [it, ...[...Array(inv.content.levels || 4)].map(() => '')]),
              theme: 'grid',
              styles: { fontSize: 8 },
              headStyles: { fillColor: [71, 85, 105] }
            });
            currentY = (doc as any).lastAutoTable.finalY + 15;
          }
        });
      }

      // Save the PDF
      const fileName = `SdA_${targetBlock.stage}_${targetBlock.level}_${title.replace(/\s+/g, '_')}.pdf`;
      doc.save(fileName);
      
      alert(`¡PDF "${fileName}" generado con éxito!`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Hubo un error al generar el PDF. Revisa la consola.");
    }
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
          content += `- **Criterio:** ${crit.description}\n`;
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
        content += `### [${sb.category}] ${sb.description}\n\n`;
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
      content += `*Modalidad: ${block.plan.finalProductMode === 'cumulative' ? 'Acumulativo' : 'Recopilatorio'}*\n\n`;
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
        if (act.exercises) {
          content += `**Tareas/Ejercicios:** ${act.exercises}\n\n`;
        }
        if (act.methodology) {
          content += `**Metodología:** ${act.methodology}\n\n`;
        }
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

    if (block.diversity && block.diversity.measures && block.diversity.measures.length > 0) {
      content += `## Adaptaciones al Grupo y Medidas de Atención a la Diversidad\n\n`;
      block.diversity.measures.forEach(m => {
        content += `### [${m.type}] ${m.need}\n`;
        content += `**Medida:** ${m.measure}\n`;
        content += `**Ajustes Metodológicos:** ${m.methodologyAdjustments}\n\n`;
      });
      if (block.diversity.generalObservations) {
        content += `**Situación de partida / Contexto:**\n${block.diversity.generalObservations}\n\n`;
      }
    }

    if (block.groupDiversity) {
      Object.entries(block.groupDiversity).forEach(([groupId, diversity]) => {
        const group = studentGroups.find(g => g.id === groupId);
        if (group && diversity.measures && diversity.measures.length > 0) {
          content += `## Adaptaciones para el Grupo: ${group.course} ${group.letter} (${group.school})\n\n`;
          diversity.measures.forEach(m => {
            content += `### [${m.type}] ${m.need}\n`;
            content += `**Medida:** ${m.measure}\n`;
            content += `**Ajustes Metodológicos:** ${m.methodologyAdjustments}\n\n`;
          });
        }
      });
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
        // If current active block is still in local, keep it. Otherwise, stay in gallery (empty string).
        setActiveBlockId(prev => (prev && local.find(b => b.id === prev)) ? prev : '');
      }
      setIsFirestoreLoading(false);
      return;
    }
    
    setIsFirestoreLoading(true);

    // Validate connection
    getDocFromServer(doc(db, 'situations', 'conn-test')).catch(err => {
      if (err.message?.includes('offline')) {
        console.error("Firestore appears to be offline or config is invalid.");
      }
    });
    
    // First, fetch current cloud data
    const q = query(
      collection(db, 'situations'), 
      where('userId', '==', user.uid)
    );
    
    // migration logic: push local meaningful data to cloud
    // But ONLY if we don't have cloud data yet or to ensure consistency
    const migrateLocalToCloud = async () => {
      try {
        const localSaved = localStorage.getItem('kerygma_blocks');
        if (localSaved) {
          const localBlocks: CurriculumBlock[] = JSON.parse(localSaved);
          // Less restrictive: any block that has been touched or has any content
          const meaningfulBlocks = localBlocks.filter(b => b.initialized || b.title || b.stage);
          
          for (const block of meaningfulBlocks) {
            const isDefault = block.id.startsWith('primaria-') || block.id.startsWith('infantil-') || block.id.startsWith('secundaria-') || block.id.startsWith('bach-');
            const safeId = isDefault && !block.id.includes(user.uid.slice(0, 5))
              ? `${block.id}-${user.uid.slice(0, 5)}` 
              : block.id;
            
            // Only claim if it doesn't already belong to someone else
            if (!block.userId || block.userId === user.uid) {
              await syncBlock({ ...block, id: safeId, userId: user.uid });
            }
          }
        }
      } catch (e) {
        console.error("Migration error:", e);
      }
    };

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const remoteBlocks = snapshot.docs.map(doc => ({ 
        ...doc.data(), 
        id: doc.id 
      } as CurriculumBlock));
      
      setBlocks(currentBlocks => {
        const mergedMap = new Map<string, CurriculumBlock>();
        const userSuffix = user.uid.slice(0, 5);
        
        // 1. Cloud data is the absolute source of truth
        remoteBlocks.forEach(rb => mergedMap.set(rb.id, rb));
        
        // 2. Merge local blocks
        currentBlocks.forEach(lb => {
          const isDefault = lb.id.startsWith('primaria-') || lb.id.startsWith('infantil-') || lb.id.startsWith('secundaria-') || lb.id.startsWith('bach-');
          const suffixedId = (isDefault && !lb.id.includes(userSuffix)) ? `${lb.id}-${userSuffix}` : null;
          
          const localId = lb.id;
          const cloudMatch = mergedMap.get(localId) || (suffixedId ? mergedMap.get(suffixedId) : null);

          if (cloudMatch) {
            if (syncTimeoutRef.current[localId]) {
              mergedMap.set(cloudMatch.id, { ...lb, id: cloudMatch.id });
            }
          } else {
            // If it's not in cloud, only keep it if it hasn't been synced yet (no userId)
            // or if it's currently being synced (has a pending timeout).
            // This prevents deleted cloud blocks from reappearing when the local state still has them.
            const isPendingSync = syncTimeoutRef.current[localId];
            const hasNotSyncedYet = !lb.userId;
            
            if (hasNotSyncedYet || isPendingSync) {
              const finalId = suffixedId || lb.id;
              mergedMap.set(finalId, { ...lb, id: finalId, userId: user.uid });
            }
          }
        });
        
        const mergedArray = Array.from(mergedMap.values())
          .sort((a, b) => {
            const timeA = (a.updatedAt as any)?.seconds || 0;
            const timeB = (b.updatedAt as any)?.seconds || 0;
            if (timeA !== timeB) return timeB - timeA;
            return b.id.localeCompare(a.id);
          });
        
        // We use functional update to check against the LATEST activeBlockId
        setActiveBlockId(currentActiveId => {
          if (currentActiveId && !mergedArray.find(b => b.id === currentActiveId)) {
            const deletedBlock = currentBlocks.find(b => b.id === currentActiveId);
            if (deletedBlock) {
              setViewSelection({ stage: deletedBlock.stage, level: deletedBlock.level });
            }
            return '';
          }
          return currentActiveId;
        });
        
        return mergedArray;
      });

      setIsFirestoreLoading(false);
    }, (error) => {
      console.error("Firestore onSnapshot error:", error);
      handleFirestoreError(error, OperationType.LIST, 'situations');
      setIsFirestoreLoading(false);
    });

    // Run migration after a small delay to let onSnapshot settle
    const migTimer = setTimeout(migrateLocalToCloud, 2000);

    return () => {
      unsubscribe();
      clearTimeout(migTimer);
    };
  }, [user, db, loading]);

  // Sync studentGroups with Firestore when logged in
  useEffect(() => {
    if (!db || !user) return;
    
    const q = query(
      collection(db, 'studentGroups'), 
      where('userId', '==', user.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const groups = snapshot.docs.map(doc => ({ 
        ...doc.data(), 
        id: doc.id 
      } as StudentGroup));
      setStudentGroups(groups);
    }, (error) => {
      console.error("Firestore groups onSnapshot error:", error);
      handleFirestoreError(error, OperationType.LIST, 'studentGroups');
    });
    
    return () => unsubscribe();
  }, [user, db]);

  const syncBlock = async (block: CurriculumBlock) => {
    if (!user || !db) return;
    
    // Ensure the block being synced belongs to the user
    if (block.userId && block.userId !== user.uid) return;

    // Debounce sync
    if (syncTimeoutRef.current[block.id]) {
      clearTimeout(syncTimeoutRef.current[block.id]);
    }

    const blockIdForSync = block.id;

    syncTimeoutRef.current[blockIdForSync] = setTimeout(async () => {
      setSyncingCount(prev => prev + 1);
      
      const sanitize = (obj: any): any => {
        if (obj === null || obj === undefined) return null;
        if (Array.isArray(obj)) return obj.map(sanitize);
        if (typeof obj === 'object') {
          if (obj.constructor !== Object && obj.constructor !== Array) return obj;
          const result: any = {};
          Object.entries(obj).forEach(([key, value]) => {
            if (value !== undefined) result[key] = sanitize(value);
          });
          return result;
        }
        return obj;
      };

      try {
        const userSuffix = user.uid.slice(0, 5);
        const isDefault = block.id.startsWith('primaria-') || block.id.startsWith('infantil-') || block.id.startsWith('secundaria-') || block.id.startsWith('bach-');
        const finalId = (isDefault && !block.id.includes(userSuffix)) ? `${block.id}-${userSuffix}` : block.id;

        const sanitizedBlock = sanitize({ 
          ...block, 
          id: finalId,
          userId: user.uid,
          updatedAt: serverTimestamp() 
        });

        await setDoc(doc(db, 'situations', finalId), sanitizedBlock, { merge: true });
      } catch (error) {
        console.error("Sync error for block:", block.id, error);
        // We don't want to show a popup for every keypress error if network is just temporarily down
        // but we should at least log it.
      } finally {
        setSyncingCount(prev => Math.max(0, prev - 1));
        delete syncTimeoutRef.current[blockIdForSync];
      }
    }, 1000); // Increased debounce to reduce write pressure
  };

  // Local storage persistence Cache
  useEffect(() => {
    localStorage.setItem('kerygma_blocks', JSON.stringify(blocks));
  }, [blocks]);

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
            } else if (activeBlock.stage === 'Bachillerato') {
              if (activeBlock.level === '1º Bachillerato') criteria = CRITERIOS_BACHILLERATO_1[ce.id] || [];
              else if (activeBlock.level === '2º Bachillerato') criteria = CRITERIOS_BACHILLERATO_2[ce.id] || [];
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

      setBlocks(prev => {
        const next = prev.map(b => {
          if (b.id !== activeBlock.id) return b;
          
          const currentCompetencias = activeBlock.stage === 'Secundaria' ? COMPETENCIAS_ESO : activeBlock.stage === 'Infantil' ? COMPETENCIAS_INFANTIL : activeBlock.stage === 'Primaria' ? COMPETENCIAS_PRIMARIA : activeBlock.stage === 'Bachillerato' ? COMPETENCIAS_BACHILLERATO : [];

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
                } else if (activeBlock.stage === 'Bachillerato') {
                  if (activeBlock.level === '1º Bachillerato') allCriteria = CRITERIOS_BACHILLERATO_1[ce.id] || [];
                  else if (activeBlock.level === '2º Bachillerato') allCriteria = CRITERIOS_BACHILLERATO_2[ce.id] || [];
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
          setTimeout(() => syncBlock(updated), 0);
          return updated;
        });
        return next;
      });
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
        setTimeout(() => syncBlock(updated), 0);
        return updated;
      });
      return next;
    });
    setIsEvaluating(null);
  };

  const toggleSaberLink = (ceId: string, critId: string, saberId: string) => {
    if (!activeBlock) return;
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
        setTimeout(() => syncBlock(updated), 0);
        return updated;
      });
      return next;
    });
  };

  const updateBlock = (blockId: string, updates: Partial<CurriculumBlock>) => {
    setBlocks(prev => {
      const block = prev.find(b => b.id === blockId);
      if (!block) return prev;

      let targetId = blockId;
      const isDefault = blockId.startsWith('primaria-') || blockId.startsWith('infantil-') || blockId.startsWith('secundaria-') || blockId.startsWith('bach-');
      if (user && isDefault && !blockId.includes(user.uid.slice(0, 5))) {
        targetId = `${blockId}-${user.uid.slice(0, 5)}`;
      }

      const updated = { ...block, ...updates, id: targetId };
      
      // Trigger sync and ID management
      setTimeout(() => {
        syncBlock(updated);
        if (targetId !== blockId && activeBlockId === blockId) {
          setActiveBlockId(targetId);
        }
      }, 0);
      
      return prev.map(b => b.id === blockId ? updated : b);
    });
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

    const getCourseCode = (l: string) => {
      const match = l.match(/\d+/);
      const num = match ? match[0] : l;
      if (stage === 'Infantil') {
        if (num === '3') return '1';
        if (num === '4') return '2';
        if (num === '5') return '3';
      }
      return num;
    };

    const courseCode = getCourseCode(level);

    const mapCompetencias = (comps: any[], criteriaMap: Record<string, any[]>) => {
      return comps.map((ce, index) => {
        const compNum = index + 1;
        const newCompId = `REL.${courseCode}.${compNum}`;
        const originalCriteria = criteriaMap[ce.id] || [];
        return {
          ...ce,
          id: newCompId,
          criteriosEvaluación: originalCriteria.map((crit) => ({
            ...crit,
            id: `${newCompId}.1`,
          }))
        };
      });
    };

    if (stage === 'Secundaria') {
      const criteriaMap = level === '1º ESO' ? CRITERIOS_ESO_1 :
                        level === '2º ESO' ? CRITERIOS_ESO_2 :
                        level === '3º ESO' ? CRITERIOS_ESO_3 :
                        level === '4º ESO' ? CRITERIOS_ESO_4 : {};
      
      updates.competenciasEspecíficas = mapCompetencias(COMPETENCIAS_ESO, criteriaMap);

      if (level === '1º ESO' || level === '2º ESO') {
        updates.saberesBásicos = SABERES_ESO_1_2;
      } else if (level === '3º ESO' || level === '4º ESO') {
        updates.saberesBásicos = SABERES_ESO_3_4;
      } else {
        updates.saberesBásicos = [];
      }
    } else if (stage === 'Infantil') {
      const criteriaMap = level === '3 años' ? CRITERIOS_INFANTIL_3ANOS :
                        level === '4 años' ? CRITERIOS_INFANTIL_4ANOS :
                        level === '5 años' ? CRITERIOS_INFANTIL_5ANOS : {};
      
      updates.competenciasEspecíficas = mapCompetencias(COMPETENCIAS_INFANTIL, criteriaMap);
      updates.saberesBásicos = SABERES_INFANTIL;
    } else if (stage === 'Bachillerato') {
      const criteriaMap = level === '1º Bachillerato' ? CRITERIOS_BACHILLERATO_1 :
                        level === '2º Bachillerato' ? CRITERIOS_BACHILLERATO_2 : {};
      
      updates.competenciasEspecíficas = mapCompetencias(COMPETENCIAS_BACHILLERATO, criteriaMap);
      updates.saberesBásicos = SABERES_BACHILLERATO;
    } else if (stage === 'Primaria') {
      const criteriaMap = level === '1º Primaria' ? CRITERIOS_PRIMARIA_1 :
                        level === '2º Primaria' ? CRITERIOS_PRIMARIA_2 :
                        level === '3º Primaria' ? CRITERIOS_PRIMARIA_3 :
                        level === '4º Primaria' ? CRITERIOS_PRIMARIA_4 :
                        level === '5º Primaria' ? CRITERIOS_PRIMARIA_5 :
                        level === '6º Primaria' ? CRITERIOS_PRIMARIA_6 : {};
      
      updates.competenciasEspecíficas = mapCompetencias(COMPETENCIAS_PRIMARIA, criteriaMap);
      
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
        setTimeout(() => syncBlock(newBlock), 0);
        return newBlock;
      });
      return next;
    });
  };

  const handleSuggest = async (type: 'criterio' | 'saber', parentId: string, item: Criterio | SaberBásico) => {
    if (!activeBlock) return;
    setIsGenerating(item.id);
    const suggestion = await suggestConcrecion(activeBlock.stage, activeBlock.level, item.description, type);
    updateConcrecion(activeBlock.id, type, parentId, item.id, suggestion);
    setIsGenerating(null);
  };

  const toggleElementSelection = (blockId: string, type: 'criterio' | 'saber', parentId: string, id: string) => {
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
        setTimeout(() => syncBlock(nb), 0);
        return nb;
      });
      return next;
    });
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

  const addNewBlock = (stageOverride?: CurriculumBlock['stage'], levelOverride?: string) => {
    const id = `block-${Date.now()}`;
    const newBlock: CurriculumBlock = {
      id,
      userId: user?.uid,
      title: '',
      stage: stageOverride || viewSelection?.stage || 'Secundaria', 
      level: levelOverride || viewSelection?.level || '1º ESO',
      initialized: false,
      step: 'selection',
      competenciasEspecíficas: [],
      saberesBásicos: []
    };
    
    setBlocks(prev => [...prev, newBlock]);
    setActiveBlockId(id);
    setViewSelection(null); // Clear gallery view when creating/entering a block
    setActiveGroupId(null);
    
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
    
    // Find info about the block before deleting it to stay in the same course view
    const blockToDelete = blocks.find(b => b.id === id);
    const stage = blockToDelete?.stage;
    const level = blockToDelete?.level;

    // Backup for rollback
    const blockToRestore = blockToDelete;

    // Optimistic local delete
    setBlocks(prev => {
      const next = prev.filter(b => b.id !== id);
      if (activeBlockId === id) {
        setActiveBlockId('');
        if (stage && level) {
          setViewSelection({ stage, level });
        }
      }
      return next;
    });
    setDeleteConfirmation(null);

    // Cancel any pending sync for this block
    if (syncTimeoutRef.current[id]) {
      clearTimeout(syncTimeoutRef.current[id]);
      delete syncTimeoutRef.current[id];
    }

    // Remote delete if logged in
    if (user && db) {
      try {
        console.log("Attempting to delete situation with ID:", id);
        await deleteDoc(doc(db, 'situations', id));
        console.log("Situation deleted successfully from Firestore");
      } catch (error) {
        console.error("Delete failed:", error);
        // Rollback
        if (blockToRestore) {
           setBlocks(prev => [...prev, blockToRestore]);
        }
        handleFirestoreError(error, OperationType.DELETE, `situations/${id}`);
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
        setTimeout(() => syncBlock(updated), 0);
        return updated;
      });
      return next;
    });
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
        finalProductMode: 'recopilatory',
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

  const handleExportIndividualInstrument = (inv: EvaluationInstrument) => {
    if (!activeBlock) return;
    try {
      const doc = new jsPDF();
      let currentY = 20;

      // Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(inv.name, 20, currentY);
      currentY += 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(`Tipo: ${inv.type || 'Instrumento de Evaluación'}`, 20, currentY);
      currentY += 10;

      doc.setFont("helvetica", "normal");
      const descLines = doc.splitTextToSize(inv.description, 170);
      doc.text(descLines, 20, currentY);
      currentY += (descLines.length * 5) + 12;

      // Content rendering
      if (inv.type === 'Rúbrica' && inv.content?.rows) {
        autoTable(doc, {
          startY: currentY,
          head: [['CRITERIO', ...(inv.content.headers || [])]],
          body: inv.content.rows.map((r: any) => [r.criteria, ...(r.cells || [])]),
          theme: 'grid',
          styles: { fontSize: 8, cellPadding: 3 },
          headStyles: { fillColor: [30, 41, 59] }
        });
      } else if (inv.type === 'Lista de Cotejo' && inv.content?.items) {
        autoTable(doc, {
          startY: currentY,
          head: [['INDICADOR DE LOGRO', 'SÍ', 'NO', 'OBSERVACIONES']],
          body: inv.content.items.map((it: any) => [it, '', '', '']),
          theme: 'grid',
          columnStyles: { 1: { cellWidth: 15 }, 2: { cellWidth: 15 } }
        });
      } else if (inv.type === 'Prueba Escrita' && inv.content?.questions) {
        inv.content.questions.forEach((q: any, qIdx: number) => {
          if (currentY > 260) { doc.addPage(); currentY = 20; }
          doc.setFont("helvetica", "bold");
          doc.text(`${qIdx + 1}. ${q.question}`, 20, currentY);
          currentY += 8;
          if (q.options) {
            q.options.forEach((opt: string) => {
              doc.setFont("helvetica", "normal");
              doc.text(`[ ] ${opt}`, 25, currentY);
              currentY += 6;
            });
          } else {
            currentY += 15;
          }
          currentY += 5;
        });
      } else if (inv.type === 'Escala de Valoración' && inv.content?.items) {
        autoTable(doc, {
          startY: currentY,
          head: [['ÍTEM', ...(inv.content.scale || [])]],
          body: inv.content.items.map((it: any) => [it, ...(inv.content.scale || []).map(() => '')]),
          theme: 'grid'
        });
      } else if (inv.type === 'Diana de Autoevaluación' && inv.content?.indicators) {
        autoTable(doc, {
          startY: currentY,
          head: [['INDICADOR / ÁREA', '1', '2', '3', '4', '5'].slice(0, (inv.content.levels || 4) + 1)],
          body: inv.content.indicators.map((it: any) => [it, ...[...Array(inv.content.levels || 4)].map(() => '')]),
          theme: 'grid',
          headStyles: { fillColor: [225, 29, 72] }
        });
      }

      doc.save(`${inv.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("Error exporting instrument:", error);
      alert("Error al generar el PDF del instrumento.");
    }
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
        instruments: result.instruments.map((ins, i) => ({ ...ins, id: `inst-${Date.now()}-${i}` })),
        generalCriteria: ''
      }
    });
    setIsAnalyzing(false);
  };

  const renderVal = (val: any) => {
    if (typeof val === 'string' || typeof val === 'number') return val;
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') {
      return val.label || val.description || val.criteria || val.text || val.question || JSON.stringify(val);
    }
    return String(val);
  };

  const handleImproveInstrument = async () => {
    if (!editingInstrument || !activeBlock || !activeBlock.plan) return;
    setIsImprovingInstrument(true);
    try {
      const result = await improveInstrument(
        editingInstrument.name,
        editingInstrument.description,
        activeBlock.activities?.filter((_, i) => editingInstrument.linkedActivitiesIds.includes(i.toString())).map(a => ({ title: a.title, description: a.description })) || [],
        activeBlock.plan.suggestedContent
      );

      // Clean content to ensure arrays only have strings where expected
      let cleanContent = result.content;
      if (cleanContent) {
        if (result.type === 'Diana de Autoevaluación' && Array.isArray(cleanContent.indicators)) {
          cleanContent.indicators = cleanContent.indicators.map((i: any) => typeof i === 'string' ? i : (i.label || i.description || JSON.stringify(i)));
        }
        if (result.type === 'Lista de Cotejo' && Array.isArray(cleanContent.items)) {
          cleanContent.items = cleanContent.items.map((i: any) => typeof i === 'string' ? i : (i.label || i.description || JSON.stringify(i)));
        }
        if (result.type === 'Rúbrica' && Array.isArray(cleanContent.rows)) {
          cleanContent.rows = cleanContent.rows.map((row: any) => ({
            ...row,
            criteria: typeof row.criteria === 'string' ? row.criteria : (row.criteria?.label || row.criteria?.description || JSON.stringify(row.criteria)),
          }));
        }
      }

      setEditingInstrument({
        ...editingInstrument,
        name: result.name,
        description: result.description,
        type: result.type as any,
        content: cleanContent
      });
    } catch (error: any) {
      console.error("Error improving instrument:", error);
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        alert("Límite de cuota alcanzado. Inténtalo de nuevo en unos minutos.");
      } else {
        alert("No se pudo conectar con la IA para mejorar el instrumento.");
      }
    } finally {
      setIsImprovingInstrument(false);
    }
  };

  const handleCopyManualPrompt = () => {
    if (!editingInstrument || !activeBlock || !activeBlock.plan) return;
    const activities = activeBlock.activities?.filter((_, i) => editingInstrument.linkedActivitiesIds.includes(i.toString())).map(a => ({ title: a.title, description: a.description })) || [];
    const prompt = getInstrumentManualPrompt(
      editingInstrument.name,
      editingInstrument.description,
      activities,
      activeBlock.plan.suggestedContent
    );
    navigator.clipboard.writeText(prompt);
    setCopiedId('manual-prompt');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerateRealInstrument = async (instrument: EvaluationInstrument) => {
    if (!activeBlock || !activeBlock.plan) return;
    setIsGenerating(instrument.id);
    try {
      const result = await improveInstrument(
        instrument.name,
        instrument.description,
        activeBlock.activities?.filter((_, i) => instrument.linkedActivitiesIds.includes(i.toString())).map(a => ({ title: a.title, description: a.description })) || [],
        activeBlock.plan.suggestedContent
      );
      
      // Clean content
      let cleanContent = result.content;
      if (cleanContent) {
        if (result.type === 'Diana de Autoevaluación' && Array.isArray(cleanContent.indicators)) {
          cleanContent.indicators = cleanContent.indicators.map((i: any) => typeof i === 'string' ? i : (i.label || i.description || JSON.stringify(i)));
        }
        if (result.type === 'Lista de Cotejo' && Array.isArray(cleanContent.items)) {
          cleanContent.items = cleanContent.items.map((i: any) => typeof i === 'string' ? i : (i.label || i.description || JSON.stringify(i)));
        }
        if (result.type === 'Rúbrica' && Array.isArray(cleanContent.rows)) {
          cleanContent.rows = cleanContent.rows.map((row: any) => ({
            ...row,
            criteria: typeof row.criteria === 'string' ? row.criteria : (row.criteria?.label || row.criteria?.description || JSON.stringify(row.criteria)),
          }));
        }
      }

      const newInstrument = {
        ...instrument,
        name: result.name,
        description: result.description,
        type: result.type as any,
        content: cleanContent
      };

      const instruments = [...(activeBlock.evaluation?.instruments || [])];
      const index = instruments.findIndex(i => i.id === instrument.id);
      if (index >= 0) {
        instruments[index] = newInstrument;
        updateBlock(activeBlock.id, { 
          evaluation: { 
            ...(activeBlock.evaluation || { instruments: [] }), 
            instruments 
          } 
        });
      }
    } catch (e: any) {
      console.error(e);
      if (e.message?.includes('429') || e.message?.includes('quota')) {
        alert("Se ha superado el límite de uso de la IA para hoy. Pronto volverá a estar disponible.");
      } else {
        alert("Hubo un error al generar el instrumento con IA.");
      }
    } finally {
      setIsGenerating(null);
    }
  };

  const handleSaveInstrument = () => {
    if (!editingInstrument || !activeBlock) return;
    const instruments = [...(activeBlock.evaluation?.instruments || [])];
    const index = instruments.findIndex(i => i.id === editingInstrument.id);
    
    if (index >= 0) {
      instruments[index] = editingInstrument;
    } else {
      instruments.push(editingInstrument);
    }
    
    updateBlock(activeBlock.id, { 
      evaluation: { 
        ...(activeBlock.evaluation || { instruments: [] }), 
        instruments 
      } 
    });
    setEditingInstrument(null);
  };

  const handleGenerateDiversityAction = async (needs: string, groupId?: string, blockId?: string) => {
    const targetBlockId = blockId || activeBlockId;
    const targetBlock = blocks.find(b => b.id === targetBlockId);
    
    if (!targetBlock) return;

    // If we are in groups view, navigate to the SdA to show progress
    if (groupId) {
      setActiveBlockId(targetBlockId);
      setActiveGroupId(null);
      updateBlock(targetBlockId, { step: 'diversity' });
      // Wait a bit for the UI to switch
    }

    if (!targetBlock.activities || !targetBlock.plan) {
      console.warn("SdA not ready for diversity measures. Content or activities missing.");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const result = await generateDiversityMeasures(
        targetBlock.activities.map(a => ({ title: a.title, description: a.description })),
        targetBlock.plan.suggestedContent,
        needs
      );
      
      if (groupId) {
        const currentMap = targetBlock.groupDiversity || {};
        updateBlock(targetBlockId, {
          groupDiversity: {
            ...currentMap,
            [groupId]: {
              measures: result.measures.map((m, i) => ({ ...m, id: `div-${groupId}-${i}` }) as any),
              generalObservations: `Adaptaciones específicas para el grupo: ${needs}`
            }
          }
        });
      } else {
        updateBlock(targetBlockId, { 
          diversity: {
            measures: result.measures.map((m, i) => ({ ...m, id: `div-${i}` }) as any),
            generalObservations: `Necesidades atendidas: ${needs}`
          }
        });
      }
    } catch (error) {
      console.error("Error generating diversity measures:", error);
    } finally {
      setIsAnalyzing(false);
    }
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
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} version="weekly">
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
          <p className="text-[8px] text-gray-400 font-bold leading-tight mt-2 max-w-xs">
            Planificador de Situaciones de Aprendizaje<br />
            de Religión Católica para Andalucía
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
              <div 
                className="flex items-baseline leading-none cursor-pointer"
                onClick={() => {
                  setActiveBlockId('');
                  setViewSelection(null);
                  setActiveGroupId(null);
                }}
              >
                <span className="text-4xl font-bold tracking-tighter serif text-primary italic">Kerygma</span>
                <span className="text-4xl font-black tracking-tighter text-accent ml-0.5">APP</span>
              </div>
              <p className="text-[9px] text-gray-400 font-bold leading-tight mt-2 max-w-xs">
                Planificador de Situaciones de Aprendizaje<br />
                de Religión Católica para Andalucía
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

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* GRUPOS */}
          <div className="space-y-1">
            <div className="px-2 mb-2 flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mis centros y grupos</h3>
              <button 
                onClick={() => setShowAddGroupModal(true)}
                className="text-primary hover:text-primary/70 transition-colors"
                title="Añadir grupo"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {(() => {
              const schoolsList: string[] = Array.from(new Set(studentGroups.map(g => g.school)) as Set<string>).sort();
              return schoolsList.map((schoolName: string) => {
                const isSchoolExpanded = expandedGroups[schoolName] ?? true;
                const groupsInSchool = studentGroups.filter(g => g.school === schoolName);
                
                return (
                  <div key={schoolName} className="space-y-1">
                    <button
                      onClick={() => {
                        const next = { ...expandedGroups };
                        next[schoolName] = !isSchoolExpanded;
                        setExpandedGroups(next);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
                        activeGroupId && groupsInSchool.some(g => g.id === activeGroupId)
                          ? 'bg-accent/5 text-accent' 
                          : 'text-gray-600 hover:bg-accent/5'
                      }`}
                    >
                      <div className="flex items-center gap-3 font-bold text-[10px] uppercase tracking-wider truncate">
                        <School className={`w-4 h-4 ${isSchoolExpanded ? 'text-accent' : 'text-gray-400'}`} />
                        <span className="truncate">{schoolName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-accent/10 text-accent px-1.5 py-0.5 rounded-md">{groupsInSchool.length}</span>
                        {isSchoolExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      </div>
                    </button>

                    {isSchoolExpanded && (
                      <div className="ml-4 space-y-1 border-l-2 border-gray-50 pl-2">
                        {groupsInSchool.sort((a,b) => a.course.localeCompare(b.course)).map(group => (
                          <div 
                            key={group.id}
                            className={`group flex items-center justify-between p-1 pr-2 rounded-lg cursor-pointer transition-all ${
                              activeGroupId === group.id 
                                ? 'bg-primary text-white font-bold shadow-md shadow-primary/20' 
                                : 'text-gray-500 hover:bg-primary/5 hover:text-primary'
                            }`}
                          >
                            <div 
                              className="flex-1 flex items-center gap-3 p-1 rounded-lg text-xs"
                              onClick={() => {
                                setActiveGroupId(group.id);
                                setActiveBlockId('');
                                setViewSelection(null);
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <span className="truncate">{group.course} {group.letter}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingGroupId(group.id);
                                setShowAddGroupModal(true);
                              }}
                              className={`p-1 rounded-md transition-colors ${
                                activeGroupId === group.id 
                                  ? 'text-white/70 hover:text-white' 
                                  : 'text-gray-300 hover:text-primary opacity-0 group-hover:opacity-100'
                              }`}
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>

          {/* SITUACIONES */}
          <div className="space-y-1">
            <div className="px-2 mb-4 flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Situaciones de Aprendizaje</h3>
            </div>
            
            {Object.entries(STAGE_LEVELS).map(([stage, levels]) => {
              const isStageExpanded = expandedGroups[stage] ?? false;
              const hasActiveInStage = activeBlock && activeBlock.stage === stage;
              const isStageViewing = viewSelection?.stage === stage;

              return (
                <div key={stage} className="space-y-1">
                  <button
                    onClick={() => setExpandedGroups(prev => ({ ...prev, [stage]: !isStageExpanded }))}
                    className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
                      isStageViewing || hasActiveInStage
                        ? 'bg-primary/5 text-primary' 
                        : 'text-gray-600 hover:bg-accent/5'
                    }`}
                  >
                    <div className="flex items-center gap-3 font-bold text-xs uppercase tracking-wider">
                      <div className={isStageViewing || hasActiveInStage ? 'text-primary' : 'text-gray-400'}>
                        {getStageIcon(stage)}
                      </div>
                      <span>{stage}</span>
                    </div>
                    {isStageExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  
                  {isStageExpanded && (
                    <div className="ml-4 space-y-1 mt-1 border-l-2 border-accent/10 pl-2">
                      {levels.map(level => {
                        const isLevelViewing = viewSelection?.stage === stage && viewSelection?.level === level;
                        const isLevelActive = activeBlock && activeBlock.stage === stage && activeBlock.level === level;
                        const isSelected = isLevelViewing || (isLevelActive && !viewSelection);

                        return (
                          <button
                            key={level}
                            onClick={() => {
                              setViewSelection({ stage: stage as any, level });
                              setActiveBlockId('');
                              setActiveGroupId(null);
                              if (window.innerWidth < 768) setIsSidebarOpen(false);
                            }}
                            className={`w-full flex items-center p-2 rounded-lg text-left text-xs font-medium transition-all ${
                              isSelected 
                                ? 'bg-primary text-white shadow-md shadow-primary/20' 
                                : 'text-gray-500 hover:bg-accent/5'
                            }`}
                          >
                            {formatLevelDisplay(level, stage as any)}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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
        {activeBlock ? (
          <>
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
                  <div className="flex items-center gap-3 w-full max-w-xl">
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full shrink-0">
                      <span className="text-xs font-bold text-primary">{formatLevelDisplay(activeBlock.level, activeBlock.stage)}</span>
                      <div className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{activeBlock.stage}</span>
                    </div>
                    
                    <input
                      type="text"
                      value={activeBlock.title || ''}
                      onChange={(e) => updateBlock(activeBlock.id, { title: e.target.value })}
                      placeholder="Título de la Situación..."
                      className="flex-1 bg-transparent border-none p-0 focus:ring-0 font-bold text-lg text-primary placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 px-6">
                  {activeBlock.initialized && activeBlock.creationMode && (
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
                {activeBlock.initialized && activeBlock.creationMode && (
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
                            { id: 'selection', label: '1. Situación' },
                            { id: 'planning', label: '2. Propuesta' },
                            { id: 'sequencing', label: '3. Aula' },
                            { id: 'diversity', label: '4. Diversidad' },
                            { id: 'evaluation', label: '5. Evaluación' },
                            { id: 'docente_eval', label: '6. Práctica Docente' }
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
                          
                          {activeBlock.step === 'selection' ? (
                            <button
                              onClick={() => setStep('planning')}
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
                          ) : activeBlock.step === 'planning' ? (
                            <button
                              onClick={() => handleGenerateSequencingAction()}
                              disabled={isAnalyzing || !activeBlock.plan?.suggestedContent}
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[9px] uppercase tracking-widest transition-all ${
                                isAnalyzing || !activeBlock.plan?.suggestedContent
                                  ? 'bg-gray-50 text-gray-300'
                                  : 'bg-primary/10 text-primary hover:bg-primary/20'
                              }`}
                            >
                              {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <ChevronRight className="w-3 h-3" />}
                              Continuar al aula
                            </button>
                          ) : (
                            <div className="px-2">
                               <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">Currículo Fijado</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </header>

            <div className="flex-1 overflow-y-auto bg-gray-50/50 p-8 max-w-5xl mx-auto w-full no-scrollbar space-y-8">
              {!activeBlock.initialized ? (
                // Step 1: Initial configuration (Stage/Level)
                <div className="h-full flex flex-col items-center justify-center space-y-12 max-w-2xl mx-auto text-center">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold serif text-primary">1. Situación</h2>
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
                  <h2 className="text-4xl font-bold serif text-primary">2. Propuesta</h2>
                </div>
                <p className="text-gray-500 text-lg">Define qué vas a enseñar y cómo lo vas a hacer.</p>
              </div>

              {/* Prefs section in step 2: ONLY Focus Notes at top after title */}
              <section className="bg-white rounded-3xl border border-primary/10 shadow-xl shadow-primary/5 overflow-hidden">
                <div className="p-4 border-b border-primary/5 bg-primary/5 flex items-center gap-3">
                  <Target className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-[10px] text-primary uppercase tracking-widest">Notas de Enfoque (¿Qué tratar o evitar?) (OPCIONAL)</h3>
                </div>
                <div className="p-6">
                  <AutoResizeTextArea
                    value={activeBlock.planningNotes || ''}
                    onChange={(e) => updateBlock(activeBlock.id, { planningNotes: e.target.value })}
                    placeholder="Ej: Introduce temas de sostenibilidad, evita tecnicismos complejos..."
                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm text-gray-600 min-h-[60px] italic"
                  />
                </div>
              </section>

              {!activeBlock.plan ? (
                <div className="space-y-12">
                  <div className="bg-white rounded-[2.5rem] p-12 border border-blue-50 shadow-xl shadow-blue-500/5 text-center space-y-8">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                      <Sparkles className="w-10 h-10 text-blue-500" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-gray-900">¿Generamos tu propuesta de contenidos?</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        Usaremos los elementos curriculares seleccionados y tus materiales iniciales para diseñar un itinerario personalizado.
                      </p>
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
                </div>
              ) : (
                <div className="space-y-12">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        <h3 className="text-2xl font-bold serif text-primary">Propuesta Desarrollada</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setIsEditingPlanning(!isEditingPlanning)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest ${
                            isEditingPlanning 
                              ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                              : 'text-gray-400 hover:text-primary hover:bg-primary/5'
                          }`}
                        >
                          {isEditingPlanning ? (
                            <>
                              <Save className="w-4 h-4" />
                              <span>Guardar cambios</span>
                            </>
                          ) : (
                            <>
                              <Edit2 className="w-4 h-4" />
                              <span>Editar propuesta</span>
                            </>
                          )}
                        </button>
                        <button 
                          onClick={handleRegeneratePlanning}
                          className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-purple-50"
                          title="Probar otra sugerencia"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest">Generar otra opción</span>
                          <RotateCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </div>
                    <div className={`bg-white rounded-[2.5rem] border shadow-xl shadow-gray-200/50 transition-all ${isEditingPlanning ? 'p-8 border-primary/20 ring-4 ring-primary/5' : 'p-10 border-gray-100'}`}>
                      <div className="prose prose-slate prose-sm md:prose-base max-w-none prose-headings:serif prose-headings:text-primary prose-headings:font-bold prose-p:text-gray-600 prose-li:text-gray-600">
                        {isEditingPlanning ? (
                          <AutoResizeTextArea
                            value={activeBlock.plan.suggestedContent || ''}
                            onChange={(e) => updateBlock(activeBlock.id, { 
                              plan: { ...activeBlock.plan!, suggestedContent: e.target.value } 
                            })}
                            className="w-full bg-transparent border-none p-0 focus:ring-0 text-base leading-relaxed text-gray-700 min-h-[300px]"
                            placeholder="Escribe aquí los contenidos detallados..."
                          />
                        ) : (
                          <div className={`transition-opacity duration-300 ${isAnalyzing ? 'opacity-50' : 'opacity-100'}`}>
                            <ReactMarkdown>
                              {activeBlock.plan.suggestedContent || '_No hay contenido generado. Haz clic en "Generar otra opción" para empezar._'}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center pt-8">
                     <button
                        onClick={handleGenerateSequencingAction}
                        disabled={isAnalyzing || !activeBlock.plan?.suggestedContent}
                        className={`px-12 py-5 rounded-[2rem] font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
                          isAnalyzing || !activeBlock.plan?.suggestedContent
                            ? 'bg-gray-100 text-gray-400'
                            : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20 hover:scale-[1.02]'
                        }`}
                      >
                        {isAnalyzing ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <Workflow className="w-6 h-6" />
                        )}
                        <span>Confirmar propuesta y configurar sesiones</span>
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
                  <h2 className="text-4xl font-bold serif text-primary">3. Secuenciación y Aula</h2>
                </div>
                <p className="text-gray-500 text-lg">Tu hoja de ruta para el aula paso a paso.</p>

                {/* Summary of selected criteria for reference */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Target className="w-3 h-3" /> Criterios seleccionados para esta SdA
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(activeBlock.competenciasEspecíficas || []).flatMap(ce => ce.criteriosEvaluación.filter(c => c.selected)).map(crit => (
                      <div key={crit.id} className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-[9px] text-gray-600 shadow-sm" title={crit.description}>
                        <span className="font-bold text-primary mr-1">{crit.id}:</span>
                        {crit.description.substring(0, 60)}...
                      </div>
                    ))}
                    {((activeBlock.competenciasEspecíficas || []).flatMap(ce => ce.criteriosEvaluación.filter(c => c.selected)).length === 0) && (
                      <p className="text-[10px] text-red-400 italic">No hay criterios seleccionados. Vuelva al paso 1 para seleccionar criterios.</p>
                    )}
                  </div>
                  <p className="text-[9px] text-gray-400 mt-3 italic">
                    IMPORTANTE: Toda actividad debe vincularse a uno o varios de estos criterios para poder ser calificada en el aplicativo oficial.
                  </p>
                </div>
              </div>

              {/* Step 3: Unified Methodology and Resources Configuration */}
              <section className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/50 space-y-10">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <Settings className="w-5 h-5 text-primary" />
                  <h3 className="text-2xl font-bold serif text-primary">Configuración Metodológica y Recursos</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-8 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Estrategias Metodológicas</label>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {[
                              { id: 'abp', label: 'ABP' },
                              { id: 'coop', label: 'Cooperativo' },
                              { id: 'gam', label: 'Gamificación' },
                              { id: 'flipped', label: 'Flipped Classroom' },
                              { id: 'sd', label: 'Secuencia Didáctica' },
                              { id: 'ds', label: 'Design Thinking' }
                            ].map(option => {
                              const currentValue = activeBlock.plan?.methodology || '';
                              const isSelected = currentValue.includes(option.label);
                              return (
                                <button
                                  key={option.id}
                                  onClick={() => {
                                    let newValue = '';
                                    if (isSelected) {
                                      newValue = currentValue.replace(new RegExp(`\\s*${option.label}[,]?\\s*`, 'g'), '').trim();
                                      if (newValue.endsWith(',')) newValue = newValue.slice(0, -1);
                                      if (newValue.startsWith(',')) newValue = newValue.slice(1).trim();
                                    } else {
                                      newValue = currentValue ? `${currentValue}, ${option.label}` : option.label;
                                    }
                                    updateBlock(activeBlock.id, { 
                                      plan: { ...activeBlock.plan!, methodology: newValue }
                                    });
                                  }}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase transition-all ${
                                    isSelected 
                                      ? 'bg-primary/5 border-primary/30 text-primary shadow-sm' 
                                      : 'bg-gray-50/50 border-gray-100 text-gray-400 hover:border-gray-200'
                                  }`}
                                >
                                  <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'bg-white border-gray-200'}`}>
                                    {isSelected && <Check className="w-2 h-2 text-white stroke-[4]" />}
                                  </div>
                                  {option.label}
                                </button>
                              );
                            })}
                          </div>
                          <textarea
                            value={activeBlock.plan?.methodology || ''}
                            onChange={(e) => updateBlock(activeBlock.id, { 
                              plan: { ...activeBlock.plan!, methodology: e.target.value } 
                            })}
                            placeholder="Ej: Trabajo cooperativo, ABP, uso de TIC..."
                            className="w-full h-40 bg-gray-50 border border-transparent rounded-2xl p-4 focus:ring-2 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all text-sm outline-none resize-none leading-relaxed"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Materiales y Recursos</label>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {[
                              { id: 'tabs', label: 'Dispositivos Digitales' },
                              { id: 'digital', label: 'PDI/Panel Interactivo' },
                              { id: 'manip', label: 'Material Manipulativo' },
                              { id: 'library', label: 'Biblioteca' },
                              { id: 'outdoor', label: 'Espacios Abiertos' },
                              { id: 'ai', label: 'Herramientas IA' }
                            ].map(option => {
                              const currentValue = activeBlock.materials || '';
                              const isSelected = currentValue.includes(option.label);
                              return (
                                <button
                                  key={option.id}
                                  onClick={() => {
                                    let newValue = '';
                                    if (isSelected) {
                                      newValue = currentValue.replace(new RegExp(`\\s*${option.label}[,]?\\s*`, 'g'), '').trim();
                                      if (newValue.endsWith(',')) newValue = newValue.slice(0, -1);
                                      if (newValue.startsWith(',')) newValue = newValue.slice(1).trim();
                                    } else {
                                      newValue = currentValue ? `${currentValue}, ${option.label}` : option.label;
                                    }
                                    updateBlock(activeBlock.id, { materials: newValue });
                                  }}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase transition-all ${
                                    isSelected 
                                      ? 'bg-purple-50 border-purple-200 text-purple-600 shadow-sm' 
                                      : 'bg-gray-50/50 border-gray-100 text-gray-400 hover:border-gray-200'
                                  }`}
                                >
                                  <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${isSelected ? 'bg-purple-500 border-purple-500' : 'bg-white border-gray-200'}`}>
                                    {isSelected && <Check className="w-2 h-2 text-white stroke-[4]" />}
                                  </div>
                                  {option.label}
                                </button>
                              );
                            })}
                          </div>
                          <textarea
                            value={activeBlock.materials || ''}
                            onChange={(e) => updateBlock(activeBlock.id, { materials: e.target.value })}
                            placeholder="Ej: Tengo tabletas para todos, materiales impresos..."
                            className="w-full h-40 bg-gray-50 border border-transparent rounded-2xl p-4 focus:ring-2 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all text-sm outline-none resize-none leading-relaxed"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Número de Sesiones</label>
                          <select
                            value={activeBlock.plan?.numberOfSessions || 4}
                            onChange={(e) => updateBlock(activeBlock.id, { 
                              plan: { ...activeBlock.plan!, numberOfSessions: parseInt(e.target.value) } 
                            })}
                            className="w-full bg-gray-50 border border-transparent rounded-xl p-3 focus:ring-2 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all text-sm outline-none font-bold text-primary appearance-none cursor-pointer"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                              <option key={num} value={num}>{num} {num === 1 ? 'Sesión' : 'Sesiones'}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nº Actividades (Total)</label>
                          <select
                            value={activeBlock.plan?.numberOfActivities || 8}
                            onChange={(e) => updateBlock(activeBlock.id, { 
                              plan: { ...activeBlock.plan!, numberOfActivities: parseInt(e.target.value) } 
                            })}
                            className="w-full bg-gray-50 border border-transparent rounded-xl p-3 focus:ring-2 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all text-sm outline-none font-bold text-primary appearance-none cursor-pointer"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                              <option key={num} value={num}>{num} {num === 1 ? 'Actividad' : 'Actividades'}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duración (Minutos/Sesión)</label>
                          <div className="relative">
                            <input 
                              type="number"
                              min="1"
                              value={activeBlock.plan?.sessionDuration || 60}
                              onChange={(e) => updateBlock(activeBlock.id, {
                                plan: { ...activeBlock.plan!, sessionDuration: parseInt(e.target.value) || 0 }
                              })}
                              className="w-full bg-gray-50 border border-transparent rounded-xl p-3 focus:ring-2 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all text-sm outline-none font-bold text-primary"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">min</span>
                          </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Modalidad Producto Final</label>
                        <div className="space-y-3">
                          <button
                            onClick={() => updateBlock(activeBlock.id, { 
                              plan: { ...activeBlock.plan!, finalProductMode: 'cumulative' } 
                            })}
                            className={`w-full p-4 rounded-2xl border text-left transition-all ${
                              activeBlock.plan?.finalProductMode === 'cumulative'
                                ? 'bg-primary/5 border-primary shadow-sm'
                                : 'bg-transparent border-gray-100 hover:border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-[10px] font-bold uppercase ${activeBlock.plan?.finalProductMode === 'cumulative' ? 'text-primary' : 'text-gray-400'}`}>Acumulativo</span>
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${activeBlock.plan?.finalProductMode === 'cumulative' ? 'border-primary bg-primary' : 'border-gray-200'}`}>
                                {activeBlock.plan?.finalProductMode === 'cumulative' && <Check className="w-2.5 h-2.5 text-white stroke-[4]" />}
                              </div>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 italic leading-tight">Suma de las tareas realizadas durante la situación.</p>
                          </button>
                          
                          <button
                            onClick={() => updateBlock(activeBlock.id, { 
                              plan: { ...activeBlock.plan!, finalProductMode: 'recopilatory' } 
                            })}
                            className={`w-full p-4 rounded-2xl border text-left transition-all ${
                              activeBlock.plan?.finalProductMode === 'recopilatory'
                                ? 'bg-primary/5 border-primary shadow-sm'
                                : 'bg-transparent border-gray-100 hover:border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-[10px] font-bold uppercase ${activeBlock.plan?.finalProductMode === 'recopilatory' ? 'text-primary' : 'text-gray-400'}`}>Recopilatorio</span>
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${activeBlock.plan?.finalProductMode === 'recopilatory' ? 'border-primary bg-primary' : 'border-gray-200'}`}>
                                {activeBlock.plan?.finalProductMode === 'recopilatory' && <Check className="w-2.5 h-2.5 text-white stroke-[4]" />}
                              </div>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 italic leading-tight">Una actividad nueva que sintetiza todo lo aprendido.</p>
                          </button>
                        </div>
                      </div>
                  </div>
                </div>
                
                <div className="pt-8 border-t border-gray-50 flex justify-end">
                  <button
                    onClick={handleGenerateSequencingAction}
                    disabled={isAnalyzing}
                    className="flex items-center gap-3 px-8 py-4 bg-purple-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-purple-700 shadow-xl shadow-purple-200 transition-all disabled:opacity-50"
                  >
                    {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />}
                    <span>Actualizar Secuenciación aula</span>
                  </button>
                </div>
              </section>

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
                               <label className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${!activity.criteria ? 'text-red-500' : 'text-gray-300'}`}>
                                 <Target className={`w-3 h-3 ${!activity.criteria ? 'animate-pulse' : ''}`} /> Evaluación (Criterios)
                                 {!activity.criteria && <span className="text-[8px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">REQUERIDO PARA CALIFICAR</span>}
                               </label>
                               <AutoResizeTextArea
                                value={activity.criteria || ''}
                                onChange={(e) => {
                                  const newList = [...activeBlock.activities!];
                                  newList[index].criteria = e.target.value;
                                  updateBlock(activeBlock.id, { activities: newList });
                                }}
                                className={`w-full bg-transparent border-none p-0 focus:ring-0 text-[11px] italic transition-colors ${!activity.criteria ? 'text-red-400 placeholder:text-red-200' : 'text-gray-500'}`}
                                placeholder="Escribe o pega los códigos de los criterios (ej: 1.1, 2.3)..."
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
                  onClick={() => updateBlock(activeBlock.id, { step: 'diversity' })}
                  className="px-8 py-3 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  Atención a la Diversidad <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : activeBlock.step === 'diversity' ? (
            <div className="max-w-4xl mx-auto space-y-12 py-8 pb-32">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => updateBlock(activeBlock.id, { step: 'sequencing' })}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <h2 className="text-4xl font-bold serif text-primary">4. Diversidad</h2>
                </div>
                <p className="text-gray-500 text-lg">Adaptaciones y medidas para atender a todo el alumnado.</p>
              </div>

              {/* General Diversity Measures */}
              <div className="bg-white rounded-[2.5rem] p-10 space-y-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-accent" />
                    <h3 className="text-xl font-bold serif text-primary">Enfoque DUA</h3>
                  </div>
                  <button
                    onClick={() => handleGenerateDiversityAction("[DUA_GENERAL] Medidas DUA generales. Centradas puramente en diseño universal para el aprendizaje. IGNORA cualquier etiqueta de discapacidad (TEA, TDAH, etc.) o categorías específicas de alumnado. Solo medidas pedagógicas DUA.")}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-accent/20 hover:scale-105 transition-all text-center"
                  >
                    {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                    <span>{activeBlock.diversity ? 'Regenerar Medidas' : 'Generar Medidas DUA'}</span>
                  </button>
                </div>

                {!activeBlock.diversity || activeBlock.diversity.measures.length === 0 ? (
                  <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-3xl space-y-4">
                    <Users2 className="w-12 h-12 text-gray-300 mx-auto" />
                    <p className="text-sm text-gray-400 italic">No hay medidas generales generadas aún. La IA puede proponerte medidas DUA basadas en tu secuenciación.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {activeBlock.diversity.measures.map((m, idx) => (
                      <div key={m.id || idx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                         <p className="text-sm text-gray-700 font-bold leading-relaxed">{m.measure}</p>
                         <div className="pt-2 border-t border-gray-200/50">
                            <p className="text-[11px] text-gray-500 italic"><span className="font-bold opacity-50 not-italic uppercase text-[9px] mr-1">Metodología:</span> {m.methodologyAdjustments}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Group-Specific Adaptations */}
              {activeBlock.selectedGroupIds && activeBlock.selectedGroupIds.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 px-2">
                    <Users2 className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold serif text-primary">Adaptaciones para Grupos Asignados</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {activeBlock.selectedGroupIds.map(gid => {
                      const group = studentGroups.find(g => g.id === gid);
                      if (!group) return null;
                      const div = activeBlock.groupDiversity?.[gid];

                      return (
                        <div key={gid} className="bg-white rounded-[2rem] border border-gray-100 shadow-lg p-8 space-y-6 overflow-hidden relative">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-primary text-sm uppercase tracking-widest">{group.course} {group.letter}</h4>
                              <p className="text-[10px] text-gray-400 mt-1">{group.school}</p>
                            </div>
                            <button
                              onClick={() => handleGenerateDiversityAction("[ADAPTACION_ESPECIFICA] " + group.needsDescription, group.id, activeBlock.id)}
                              disabled={isAnalyzing}
                              className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-xl font-bold uppercase tracking-widest text-[9px] hover:bg-primary/10 transition-all"
                            >
                              {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                              {div ? 'Regenerar' : 'Generar Adaptación'}
                            </button>
                          </div>

                          {!div ? (
                            <div className="p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center">
                              <p className="text-[11px] text-gray-400 italic">No hay adaptaciones específicas para este grupo.</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                <p className="text-[10px] text-primary/70 italic leading-relaxed">{div.generalObservations}</p>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                {div.measures.map((m, i) => (
                                  <div key={m.id || i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{m.type}</span>
                                    <p className="text-[11px] text-gray-600 font-medium leading-tight">{m.measure}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => updateBlock(activeBlock.id, { step: 'diversity' })}
                      className="p-2 hover:bg-gray-100 rounded-full text-gray-400"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-4xl font-bold serif text-primary">5. Evaluación</h2>
                  </div>
                  {activeBlock.evaluation?.instruments && activeBlock.evaluation.instruments.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm('¿Estás seguro de que quieres regenerar toda la evaluación? Se borrarán los instrumentos actuales.')) {
                          handleGenerateEvaluationAction();
                        }
                      }}
                      disabled={isAnalyzing}
                      className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-red-100 transition-all disabled:opacity-50"
                    >
                      {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      <span>Regenerar Evaluación Completa</span>
                    </button>
                  )}
                </div>
                <p className="text-gray-500 text-lg">Concreción de herramientas para valorar el aprendizaje.</p>
              </div>

              {/* Coverage Check */}
              {activeBlock.evaluation?.instruments && activeBlock.evaluation.instruments.length > 0 && (
                <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-amber-800 uppercase tracking-widest flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" /> Cobertura de Actividades
                    </h4>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-amber-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 transition-all" 
                          style={{ 
                            width: `${(activeBlock.activities?.filter((_, i) => activeBlock.evaluation?.instruments.some(inst => inst.linkedActivitiesIds.includes(i.toString()))).length || 0) / (activeBlock.activities?.length || 1) * 100}%` 
                          }} 
                        />
                      </div>
                      <span className="text-[10px] font-bold text-amber-800">
                        {activeBlock.activities?.filter((_, i) => activeBlock.evaluation?.instruments.some(inst => inst.linkedActivitiesIds.includes(i.toString()))).length || 0}/{activeBlock.activities?.length || 0} Evaluadas
                      </span>
                    </div>
                  </div>
                  
                  {activeBlock.activities?.some((_, i) => !activeBlock.evaluation?.instruments.some(inst => inst.linkedActivitiesIds.includes(i.toString()))) && (
                    <div className="flex flex-wrap gap-2">
                       <p className="text-[10px] text-amber-700 w-full mb-1">Estas actividades no tienen ningún instrumento vinculado:</p>
                       {activeBlock.activities?.map((a, i) => {
                         const isEvaluated = activeBlock.evaluation?.instruments.some(inst => inst.linkedActivitiesIds.includes(i.toString()));
                         if (isEvaluated) return null;
                         return (
                           <span key={i} className="px-2 py-1 bg-white border border-amber-200 rounded-lg text-[9px] text-amber-600 font-medium">
                             Sesión {i+1}: {a.title}
                           </span>
                         );
                       })}
                    </div>
                  )}
                </div>
              )}

              {!activeBlock.evaluation?.instruments || activeBlock.evaluation.instruments.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-12 text-center space-y-6 border border-gray-100 shadow-xl shadow-gray-200/50">
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                    <ClipboardList className="w-10 h-10 text-accent" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold serif text-primary">¿Cómo vamos a evaluar?</h3>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeBlock.evaluation.instruments.map((inv, idx) => (
                      <motion.div
                        key={inv.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-gray-200/40 flex flex-col gap-6 group hover:shadow-2xl hover:shadow-primary/5 transition-all relative overflow-hidden"
                      >
                         <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-20 group-hover:opacity-100 transition-opacity" />
                         
                         <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               const newInst = activeBlock.evaluation!.instruments.filter((_, i) => i !== idx);
                               updateBlock(activeBlock.id, { evaluation: { ...activeBlock.evaluation!, instruments: newInst } });
                             }}
                             className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 z-10"
                          >
                             <Trash2 className="w-5 h-5" />
                          </button>

                        <div className="space-y-4">
                          <div className="flex gap-2 flex-wrap">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              inv.type === 'Rúbrica' ? 'bg-indigo-50 text-indigo-600' :
                              inv.type === 'Lista de Cotejo' ? 'bg-orange-50 text-orange-600' :
                              inv.type === 'Prueba Escrita' ? 'bg-violet-50 text-violet-600' :
                              inv.type === 'Escala de Valoración' ? 'bg-blue-50 text-blue-600' :
                              inv.type === 'Diana de Autoevaluación' ? 'bg-rose-50 text-rose-600' :
                              'bg-gray-100 text-gray-500'
                            }`}>
                              {inv.type || 'Instrumento'}
                            </span>
                            {inv.content && (
                              <span className="px-2.5 py-1 bg-green-50 text-green-600 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Estructura Generada
                              </span>
                            )}
                          </div>
                          
                          <h3 className="font-bold text-xl text-primary leading-tight group-hover:text-accent transition-colors">{inv.name}</h3>
                          
                          <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 italic">
                            {inv.description}
                          </p>
                        </div>

                        <div className="mt-auto pt-6 flex items-center justify-end border-t border-gray-50">
                             <button 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setEditingInstrument(inv);
                               }}
                               className="px-6 py-2.5 bg-primary/5 text-primary hover:bg-primary hover:text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2"
                             >
                               <Eye className="w-4 h-4" /> Detalles
                             </button>
                        </div>
                      </motion.div>
                    ))}

                    <button
                      onClick={() => {
                        setEditingInstrument({
                          id: `inst-new-${Date.now()}`,
                          name: '',
                          description: '',
                          linkedActivitiesIds: []
                        });
                      }}
                      className="border-2 border-dashed border-gray-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-accent hover:text-accent transition-all min-h-[160px]"
                    >
                      <Plus className="w-8 h-8" />
                      <span className="font-bold text-xs uppercase tracking-widest">Añadir Instrumento</span>
                    </button>
                  </div>

                  <div className="flex justify-center pt-8">
                    <button
                      onClick={() => updateBlock(activeBlock.id, { step: 'docente_eval' })}
                      className="px-8 py-3 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                      Continuar a Práctica Docente <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : activeBlock.step === 'docente_eval' ? (
            <div className="max-w-4xl mx-auto space-y-12 py-8 pb-32">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => updateBlock(activeBlock.id, { step: 'evaluation' })}
                      className="p-2 hover:bg-gray-100 rounded-full text-gray-400"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-4xl font-bold serif text-primary">6. Práctica Docente</h2>
                  </div>
                  <button
                    onClick={async () => {
                      setIsGenerating('reflection');
                      const unitTitle = activeBlock.title || 'Esta Situación de Aprendizaje';
                      const activities = activeBlock.activities || [];
                      const content = activeBlock.plan?.suggestedContent || '';
                      const categories = [
                        { id: 'materiaResults', label: 'Resultados de la materia' },
                        { id: 'metodosPedagogicos', label: 'Métodos didácticos' },
                        { id: 'materialesRecursos', label: 'Materiales y Recursos' },
                        { id: 'eficaciaDiversidad', label: 'Atención a la diversidad' },
                        { id: 'instrumentosVariedad', label: 'Instrumentos de evaluación' }
                      ];
                      
                      const questions = await generateDocenteReflection(unitTitle, activities, content, categories);
                      updateBlock(activeBlock.id, { 
                        docenteEval: { 
                          ...(activeBlock.docenteEval || {}), 
                          reflectionQuestions: questions 
                        } 
                      });
                      setIsGenerating(null);
                    }}
                    disabled={isGenerating === 'reflection'}
                    className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-accent/20 hover:scale-105 transition-all disabled:opacity-50"
                  >
                    {isGenerating === 'reflection' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Generar Reflexión Guiada con IA</span>
                  </button>
                </div>
                <p className="text-gray-500 text-lg italic">Organiza tu pensamiento y mejora tu práctica analizando lo sucedido en el aula.</p>
              </div>

              <div className="bg-white rounded-[2.5rem] p-10 space-y-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { field: 'materiaResults', label: 'Resultados de la materia', icon: <Target className="w-5 h-5" /> },
                  { field: 'metodosPedagogicos', label: 'Métodos didácticos', icon: <BookOpen className="w-5 h-5" /> },
                  { field: 'materialesRecursos', label: 'Materiales y Recursos', icon: <Package className="w-5 h-5" /> },
                  { field: 'eficaciaDiversidad', label: 'Atención a la diversidad', icon: <Users2 className="w-5 h-5" /> },
                  { field: 'instrumentosVariedad', label: 'Instrumentos de evaluación', icon: <ClipboardCheck className="w-5 h-5" /> }
                ].map((item, idx) => {
                  const isSelected = activeBlock.docenteEval?.selectedCategories?.includes(item.field) ?? false;
                  
                  return (
                    <button 
                      key={item.field}
                      onClick={() => {
                        const current = activeBlock.docenteEval || {};
                        const categories = current.selectedCategories || [];
                        const newCategories = isSelected 
                          ? categories.filter(c => c !== item.field)
                          : [...categories, item.field];
                        updateBlock(activeBlock.id, { docenteEval: { ...current, selectedCategories: newCategories } });
                      }}
                      className={`p-6 rounded-3xl border-2 transition-all text-left flex flex-col gap-4 group ${
                        isSelected 
                        ? 'border-accent bg-accent/5 ring-4 ring-accent/5' 
                        : 'border-gray-100 bg-gray-50 hover:border-gray-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        isSelected ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-white text-gray-400 group-hover:text-primary'
                      }`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Área {idx + 1}</p>
                        <h3 className={`font-bold text-sm leading-tight ${isSelected ? 'text-primary' : 'text-gray-600'}`}>{item.label}</h3>
                      </div>
                    </button>
                  );
                })}
                </div>

                <div className="pt-8 space-y-6">
                  {activeBlock.docenteEval?.selectedCategories && activeBlock.docenteEval.selectedCategories.length > 0 ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 px-2">
                        <Lightbulb className="w-5 h-5 text-accent" />
                        <h3 className="font-bold text-primary italic uppercase tracking-wider text-xs">Guía de Reflexión Personalizada</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6">
                        {activeBlock.docenteEval.selectedCategories.map(catId => {
                          const label = [
                            { id: 'materiaResults', label: 'Resultados de la materia' },
                            { id: 'metodosPedagogicos', label: 'Métodos didácticos' },
                            { id: 'materialesRecursos', label: 'Materiales y Recursos' },
                            { id: 'eficaciaDiversidad', label: 'Atención a la diversidad' },
                            { id: 'instrumentosVariedad', label: 'Instrumentos de evaluación' }
                          ].find(c => c.id === catId)?.label;

                          return (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              key={catId} 
                              className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-4"
                            >
                              <h4 className="font-bold text-primary text-sm flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                                {label}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeBlock.docenteEval?.reflectionQuestions?.[catId] ? (
                                  activeBlock.docenteEval.reflectionQuestions[catId].map((q, qIdx) => (
                                    <div key={qIdx} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                      <p className="text-xs text-gray-600 leading-relaxed italic">"{q}"</p>
                                    </div>
                                  ))
                                ) : (
                                  <div className="col-span-full p-4 bg-accent/5 rounded-2xl border border-dashed border-accent/20 text-center">
                                    <p className="text-xs text-accent font-medium italic">
                                      Haz clic en "Generar Reflexión Guiada" para obtener preguntas personalizadas para esta área.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 text-center space-y-4">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-gray-300 shadow-sm">
                        <Info className="w-8 h-8" />
                      </div>
                      <div className="max-w-xs mx-auto">
                        <p className="text-sm font-bold text-gray-600">Selecciona algún área de evaluación</p>
                        <p className="text-xs text-gray-400 mt-1">Elige los aspectos sobre los que quieres reflexionar para que podamos proponerte preguntas guiadas.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-12">
                <button
                  onClick={() => handleExport()}
                  disabled={isExporting}
                  className="px-8 py-4 bg-primary/10 text-primary rounded-3xl font-bold text-lg hover:bg-primary/20 transition-all flex items-center gap-3"
                >
                  <Download className="w-5 h-5" />
                  <span>Exportar a texto plano</span>
                </button>
                <button
                  onClick={() => handleExportPDF()}
                  disabled={isExporting}
                  className="px-10 py-5 bg-primary text-white rounded-[2rem] font-bold text-xl hover:scale-105 transition-all shadow-2xl shadow-primary/30 flex items-center gap-3"
                >
                  <FileText className="w-6 h-6" />
                  <span>Exportar a PDF</span>
                </button>
              </div>
            </div>
          ) : activeBlock.step === 'selection' ? (
            <motion.div
              key={activeBlock.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl mx-auto space-y-12 pb-24"
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-bold serif text-primary">1. Situación</h2>
                <p className="text-gray-500 text-lg">Selecciona los elementos curriculares para tu situación.</p>
              </div>

              {/* Preferences Box at Top of Selection - Visible and Sticky-like (first in scroll) */}
              <section className="bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-500/5 overflow-hidden">
                <div className="p-4 border-b border-blue-50 bg-blue-50/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <h3 className="font-bold text-[10px] text-blue-900 uppercase tracking-widest">Tus Materiales e Ideas (Preferencias Iniciales)</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleAnalyzeContent}
                      disabled={isAnalyzing || !activeBlock.materials}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg font-bold text-[8px] uppercase tracking-widest transition-all ${
                        isAnalyzing || !activeBlock.materials
                          ? 'bg-gray-100 text-gray-400'
                          : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20'
                      }`}
                    >
                      {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      Sincronizar Currículo
                    </button>
                    <p className="text-[10px] text-blue-300 italic">La IA usará esto para guiarte</p>
                  </div>
                </div>
                <div className="p-6">
                  <AutoResizeTextArea
                    value={activeBlock.materials || ''}
                    onChange={(e) => updateBlock(activeBlock.id, { materials: e.target.value })}
                    placeholder="Describe tus materiales o ideas iniciales..."
                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm text-gray-700 min-h-[60px]"
                  />
                </div>
              </section>

              {/* Section: Competencias and Criterios */}
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold serif text-primary">Competencias y Criterios</h2>
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
                            {(() => {
                              const match = ce.description.match(/^(\d+)\.\s*(.*)/);
                              const compNum = match ? match[1] : '';
                              const cleanDescription = match ? match[2] : ce.description;
                              const courseNum = (() => {
                                const n = activeBlock.level.match(/\d+/)?.[0] || activeBlock.level;
                                if (activeBlock.stage === 'Infantil') {
                                  if (n === '3') return '1';
                                  if (n === '4') return '2';
                                  if (n === '5') return '3';
                                }
                                return n;
                              })();
                              const prefix = `REL.${courseNum}`;
                              return `${prefix}${compNum ? `.${compNum}.` : '.'} ${cleanDescription}`;
                            })()}
                          </p>
                        </div>
                      </div>

                      <div className="p-1">
                        {ce.criteriosEvaluación.map((crit, critIdx) => (
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
                                {(() => {
                                  const match = crit.description.match(/^(\d+(\.\d+)*)\.?\s*(.*)/);
                                  const cleanDescription = match ? match[3] : crit.description;
                                  
                                  const courseNum = (() => {
                                    const n = activeBlock.level.match(/\d+/)?.[0] || activeBlock.level;
                                    if (activeBlock.stage === 'Infantil') {
                                      if (n === '3') return '1';
                                      if (n === '4') return '2';
                                      if (n === '5') return '3';
                                    }
                                    return n;
                                  })();
                                  
                                  // Extract competence number
                                  const compMatch = ce.description.match(/^(\d+)\./);
                                  const compNum = compMatch ? compMatch[1] : '1';
                                  
                                  return `REL.${courseNum}.${compNum}.1. ${cleanDescription}`;
                                })()}
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
        </>
        ) : activeGroupId ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/30">
            {(() => {
              const group = studentGroups.find(g => g.id === activeGroupId);
              if (!group) return null;
              
              return (
                <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12">
                  <motion.header 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-6">
                      <div className="p-5 bg-primary shadow-xl shadow-primary/20 rounded-[2.5rem] text-white">
                        <Users className="w-8 h-8" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-primary">Grupo: {group.course} {group.letter}</h1>
                        <div className="flex flex-col">
                          <p className="text-gray-500 font-medium">{group.school}</p>
                          {(group.municipality || group.province) && (
                            <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-accent" />
                              {group.municipality}{group.municipality && group.province ? ', ' : ''}{group.province}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.header>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="lg:col-span-1 space-y-8"
                    >
                       <section className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
                          <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                            <Compass className="w-5 h-5 text-accent" />
                            <h3 className="font-bold text-primary uppercase tracking-widest text-xs">Perfil del Grupo</h3>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Descripción General</p>
                              <p className="text-sm text-gray-600 leading-relaxed">{group.studentDescription}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Necesidades Específicas</p>
                              <div className="p-4 bg-accent/5 border border-accent/10 rounded-2xl">
                                <p className="text-sm text-accent leading-relaxed font-bold italic">{group.needsDescription}</p>
                              </div>
                            </div>
                          </div>
                       </section>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="lg:col-span-2 space-y-8"
                    >
                       <section className="space-y-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-primary flex items-center gap-3 italic">
                              <Star className="w-5 h-5 text-accent" />
                              Situaciones de Aprendizaje Asignadas
                            </h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {blocks.map(block => {
                              const isAssigned = block.selectedGroupIds?.includes(group.id);
                              const groupDiversity = block.groupDiversity?.[group.id];
                              
                              if (!isAssigned) return null;
                              
                              return (
                                <motion.div 
                                  layout
                                  key={block.id} 
                                  className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all space-y-4"
                                >
                                  <div className="flex items-center justify-between gap-4">
                                    <h4 className="font-bold text-primary leading-tight text-sm line-clamp-2">{block.title || 'SdA sin título'}</h4>
                                    <button 
                                      onClick={() => {
                                        const current = block.selectedGroupIds || [];
                                        updateBlock(block.id, { selectedGroupIds: current.filter(id => id !== group.id) });
                                      }}
                                      className="text-gray-300 hover:text-red-500 p-2 shrink-0"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>

                                  {!block.initialized ? (
                                    <div className="space-y-4">
                                      <p className="text-[10px] text-amber-600 bg-amber-50 p-3 rounded-xl font-medium leading-relaxed border border-amber-100 italic">
                                        Esta Situación de Aprendizaje aún no ha sido diseñada. Debes entrar en ella para configurarla antes de generar adaptaciones para el grupo.
                                      </p>
                                      <button 
                                        onClick={() => { setActiveBlockId(block.id); setActiveGroupId(null); }}
                                        className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                      >
                                        <Plus className="w-4 h-4" />
                                        Diseñar SdA
                                      </button>
                                    </div>
                                  ) : !groupDiversity ? (
                                    <button
                                      onClick={() => handleGenerateDiversityAction("[ADAPTACION_ESPECIFICA] " + group.needsDescription, group.id, block.id)}
                                      disabled={isAnalyzing}
                                      className="w-full py-4 bg-primary/5 text-primary rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
                                    >
                                      {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                      Generar Adaptaciones
                                    </button>
                                  ) : (
                                    <div className="space-y-4 pt-4 border-t border-gray-50">
                                      <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-bold text-green-500 uppercase flex items-center gap-1">
                                          <CheckCircle2 className="w-3 h-3" /> Adaptaciones Generadas
                                        </p>
                                        <button 
                                          onClick={() => handleGenerateDiversityAction("[ADAPTACION_ESPECIFICA] " + group.needsDescription, group.id, block.id)}
                                          disabled={isAnalyzing}
                                          className="text-[9px] font-bold text-gray-400 hover:text-primary underline uppercase tracking-widest"
                                        >
                                          Regenerar
                                        </button>
                                      </div>
                                      <div className="space-y-2">
                                        {groupDiversity.measures.slice(0, 3).map((m, i) => (
                                          <div key={i} className="text-[10px] bg-gray-50 p-2 rounded-xl text-gray-500 border border-gray-100">
                                            {m.measure.substring(0, 80)}...
                                          </div>
                                        ))}
                                      </div>
                                      <button 
                                        onClick={() => { setActiveBlockId(block.id); setActiveGroupId(null); }}
                                        className="w-full py-3 text-[10px] font-bold text-primary uppercase border-2 border-primary/10 rounded-2xl hover:bg-primary hover:text-white hover:border-primary transition-all"
                                      >
                                        Ver todas las medidas
                                      </button>
                                    </div>
                                  )}
                                </motion.div>
                              );
                            })}
                            
                            <div className="bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center gap-4 group hover:border-primary/30 transition-all">
                               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-primary shadow-sm transition-all rotate-3 group-hover:rotate-0">
                                 <Plus className="w-6 h-6" />
                               </div>
                               <div className="space-y-3 w-full">
                                 <div>
                                   <p className="text-xs font-bold text-gray-500 group-hover:text-primary transition-colors uppercase tracking-widest">Asignar SdA al Grupo</p>
                                   <p className="text-[10px] text-gray-400 mt-1 italic">SdA de {group.course} ({group.stage})</p>
                                 </div>
                                 <select 
                                   onChange={(e) => {
                                     const blockId = e.target.value;
                                     if (!blockId) return;
                                     const b = blocks.find(x => x.id === blockId);
                                     if (b) {
                                       const current = b.selectedGroupIds || [];
                                       if (!current.includes(group.id)) {
                                         updateBlock(b.id, { selectedGroupIds: [...current, group.id] });
                                       }
                                     }
                                   }}
                                   value=""
                                   className="text-[10px] font-bold bg-white border border-gray-100 rounded-xl p-3 w-full focus:ring-2 focus:ring-primary/10 outline-none cursor-pointer uppercase tracking-wider text-gray-500 shadow-sm"
                                 >
                                   <option value="">Selecciona una SdA compatible...</option>
                                   {blocks
                                     .filter(b => !b.selectedGroupIds?.includes(group.id) && b.stage === group.stage && b.level === group.course)
                                     .map(b => (
                                     <option key={b.id} value={b.id}>{b.title || `SdA ${b.id.substring(0, 5)}`}</option>
                                   ))}
                                   {blocks.filter(b => !b.selectedGroupIds?.includes(group.id) && b.stage === group.stage && b.level === group.course).length === 0 && (
                                     <option disabled>No hay más SdA diseñadas para {group.course}</option>
                                   )}
                                 </select>
                               </div>
                            </div>
                          </div>
                       </section>
                    </motion.div>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : viewSelection ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white border-b border-gray-100 p-8 flex items-center justify-between shrink-0">
               <div className="flex items-center gap-6">
                 <div className="p-4 bg-primary/5 rounded-3xl text-primary">
                   {getStageIcon(viewSelection.stage)}
                 </div>
                 <div>
                   <h1 className="text-3xl font-bold text-primary uppercase tracking-tight flex items-center gap-3">
                     {viewSelection.level}
                     <span className="text-gray-300 font-light">/</span>
                     <span className="text-gray-400 font-medium">{viewSelection.stage}</span>
                   </h1>
                   <p className="text-sm text-gray-400 mt-1">Mis situaciones de aprendizaje para este curso</p>
                 </div>
               </div>
               <button 
                 onClick={() => addNewBlock(viewSelection.stage, viewSelection.level)}
                 className="bg-primary text-white px-8 py-4 rounded-[2rem] font-bold uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20 group"
               >
                 <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                 Nueva Situación
               </button>
            </header>
            
            <div className="flex-1 overflow-y-auto p-8 lg:p-12 bg-gray-50/30">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {blocks
                  .filter(b => b.stage === viewSelection.stage && b.level === viewSelection.level)
                  .map(block => (
                    <div 
                      key={block.id}
                      className="group bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col h-full overflow-hidden relative"
                    >
                      <div className="flex-1 cursor-pointer" onClick={() => { setActiveBlockId(block.id); setViewSelection(null); setActiveGroupId(null); }}>
                        <div className="flex items-center justify-between mb-8">
                          <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            block.initialized ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {block.initialized ? block.step : 'Configuración'}
                          </div>
                          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                            SdA • {block.id.startsWith('block-') ? new Date(parseInt(block.id.split('-')[1])).toLocaleDateString() : 'Reciente'}
                          </p>
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-4 leading-tight group-hover:text-accent transition-colors">
                          {block.title || 'Nueva Situación'}
                        </h3>
                        <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed mb-6 font-medium">
                          {block.plan?.justification || 'Sin descripción aún. Haz clic para comenzar a planificar esta situación de aprendizaje.'}
                        </p>
                      </div>
                      
                      <div className="pt-6 border-t border-gray-50 flex items-center justify-between gap-4">
                        <button 
                           onClick={() => handleExport(block)}
                           disabled={!['sequencing', 'evaluation', 'diversity'].includes(block.step)}
                           className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest bg-gray-50 text-gray-500 hover:bg-primary hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                           title={!['sequencing', 'evaluation', 'diversity'].includes(block.step) ? 'Completa la secuenciación para exportar' : 'Exportar SdA'}
                        >
                           <Download className="w-4 h-4" />
                           <span>Exportar</span>
                        </button>
                        <button 
                           onClick={() => removeBlock(block.id)}
                           className="p-3.5 rounded-2xl text-red-300 hover:bg-red-50 hover:text-red-500 transition-all"
                           title="Eliminar SdA"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                
                {/* Empty state Add button */}
                <button 
                  onClick={() => addNewBlock(viewSelection.stage, viewSelection.level)}
                  className="group rounded-[2.5rem] border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center gap-4 hover:border-primary hover:bg-white transition-all min-h-[320px]"
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                    <Plus className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 group-hover:text-primary transition-colors">Crear nueva SdA</p>
                    <p className="text-xs text-gray-300 mt-1">Para {viewSelection.level}</p>
                  </div>
                </button>
              </div>
              
              {blocks.filter(b => b.stage === viewSelection.stage && b.level === viewSelection.level).length === 0 && (
                <div className="mt-12 p-12 bg-white rounded-[3rem] border border-gray-100 flex flex-col items-center justify-center text-center space-y-6">
                   <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                     <BookOpen className="w-16 h-16" />
                   </div>
                   <div className="space-y-2">
                     <h2 className="text-2xl font-bold text-primary">No hay situaciones todavía</h2>
                     <p className="text-gray-400 max-w-sm mx-auto">Comienza ahora creando tu primera situación de aprendizaje para este nivel educativo.</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8 bg-white h-full relative overflow-hidden">
             {/* Decorative Background Elements */}
             <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />
             <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -ml-48 -mb-48" />
             
             <div className="relative z-10 space-y-8 max-w-2xl">
               <div className="w-32 h-32 bg-primary shadow-2xl shadow-primary/30 rounded-[2.5rem] flex items-center justify-center text-white mx-auto rotate-12 hover:rotate-0 transition-all duration-500">
                 <Layout className="w-16 h-16" />
               </div>
               <div className="space-y-4">
                 <div className="flex items-center justify-center gap-2">
                   <span className="text-5xl font-bold tracking-tighter serif text-primary italic">Kerygma</span>
                   <span className="text-5xl font-black tracking-tighter text-accent">APP</span>
                 </div>
                 <h2 className="text-2xl font-bold text-primary">Planificador de Religión Católica</h2>
                 <p className="text-gray-500 text-lg leading-relaxed">
                   Planifica tus Situaciones de Aprendizaje de forma inteligente y creativa con Kerygma App.
                 </p>
               </div>
               <div className="pt-8 border-t border-gray-100 flex flex-col items-center gap-4">
                 <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Para comenzar</p>
                 <div className="flex items-center gap-3 text-primary font-bold animate-bounce bg-primary/5 px-6 py-3 rounded-full">
                   <ChevronLeft className="w-5 h-5" />
                   <span>Selecciona un curso en el menú lateral</span>
                 </div>
               </div>
             </div>
          </div>
        )}
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
                  onClick={() => {
                    setExportContent(null);
                    setExportingBlock(null);
                  }}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(exportContent || '');
                    alert("¡Contenido copiado al portapapeles!");
                  }}
                  className="flex-[2] py-4 bg-indigo-500 text-white font-bold rounded-2xl hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <Copy className="w-5 h-5" />
                  Copiar Texto Plano
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Edit Instrument Modal */}
      {editingInstrument && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
            onClick={() => setEditingInstrument(null)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl p-8 space-y-8 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-primary">Detalles del Instrumento</h3>
              </div>
              <button onClick={() => setEditingInstrument(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {!editingInstrument.content && (
                <div className="bg-accent/5 rounded-3xl p-10 border border-dashed border-accent/20 text-center space-y-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto text-accent shadow-lg shadow-accent/5">
                    <Sparkles className="w-10 h-10" />
                  </div>
                  <div className="max-w-xs mx-auto space-y-2">
                    <h4 className="text-lg font-bold text-primary">Generar Estructura Maestra</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">¿Deseas que la IA cree la rúbrica completa o el examen basado en los contenidos y actividades seleccionados?</p>
                  </div>
                  <div className="flex flex-col gap-3 items-center">
                    <button 
                      onClick={handleImproveInstrument}
                      disabled={isImprovingInstrument || !editingInstrument.name || !editingInstrument.description}
                      className="px-10 py-4 bg-accent text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto"
                    >
                      {isImprovingInstrument ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                      Generar Instrumento con IA
                    </button>
                  </div>
                </div>
              )}

              {editingInstrument.content && (
                <div className="bg-white rounded-[2rem] border border-gray-100 p-8 space-y-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-2">
                         <Layout className="w-3 h-3" /> Previsualización interactiva
                      </p>
                      <h4 className="text-xl font-bold text-primary">{editingInstrument.name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                       <button 
                        onClick={handleImproveInstrument}
                        disabled={isImprovingInstrument}
                        className="p-2.5 bg-gray-50 text-gray-400 hover:text-accent hover:bg-accent/5 rounded-xl transition-all"
                        title="Regenerar con IA"
                      >
                        {isImprovingInstrument ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleExportIndividualInstrument(editingInstrument)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-accent/10"
                      >
                        <Download className="w-3.5 h-3.5" /> Descargar PDF
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-1 bg-gray-50/50 rounded-2xl">
                    {editingInstrument.type === 'Rúbrica' && editingInstrument.content.rows && (
                      <div className="overflow-hidden border border-gray-100 rounded-xl shadow-sm">
                        <table className="w-full text-left border-collapse bg-white">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                              <th className="p-4 text-[10px] font-bold text-primary uppercase tracking-wider">{renderVal(editingInstrument.content.headers?.[0] || 'Criterio')}</th>
                              {(editingInstrument.content.headers || []).slice(1).map((h: string) => (
                                <th key={h} className="p-4 text-[10px] font-bold text-primary uppercase tracking-wider text-center border-l border-gray-50">{renderVal(h)}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {editingInstrument.content.rows.map((row: any, rIdx: number) => (
                              <tr key={rIdx} className="hover:bg-gray-50/30 transition-colors">
                                <td className="p-4 text-[9px] font-bold text-gray-700 bg-gray-50/20">{renderVal(row.criteria)}</td>
                                {row.cells.map((cell: string, cIdx: number) => (
                                  <td key={cIdx} className="p-4 text-[8px] text-gray-500 leading-relaxed border-l border-gray-50 text-center italic">{renderVal(cell)}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {editingInstrument.type === 'Lista de Cotejo' && editingInstrument.content.items && (
                      <div className="space-y-2 p-2">
                        {editingInstrument.content.items.map((item: string, iIdx: number) => (
                          <div key={iIdx} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
                            <div className="w-5 h-5 border-2 border-gray-100 rounded-lg flex-shrink-0" />
                            <span className="text-[11px] text-gray-600 font-medium">{renderVal(item)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {editingInstrument.type === 'Prueba Escrita' && editingInstrument.content.questions && (
                      <div className="space-y-4 p-2">
                        {editingInstrument.content.questions.map((q: any, qIdx: number) => (
                          <div key={qIdx} className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
                            <p className="text-[11px] font-bold text-primary flex gap-2">
                              <span className="text-accent">{qIdx + 1}.</span> {renderVal(q.question)}
                            </p>
                            {q.options && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6">
                                {q.options.map((opt: string, oIdx: number) => (
                                  <div key={oIdx} className="flex items-center gap-3 text-[10px] text-gray-500 bg-gray-50/50 p-2 rounded-xl border border-transparent hover:border-accent/10 transition-all">
                                    <div className="w-4 h-4 border border-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-[8px] font-bold">
                                      {String.fromCharCode(65 + oIdx)}
                                    </div>
                                    {renderVal(opt)}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {editingInstrument.type === 'Escala de Valoración' && editingInstrument.content.items && (
                      <div className="space-y-3 p-2">
                        <div className="flex justify-end gap-2 px-4 mb-2">
                          {(editingInstrument.content.scale || []).map((s: string) => (
                            <div key={s} className="w-12 text-center text-[8px] font-bold text-gray-400 uppercase tracking-widest">{renderVal(s)}</div>
                          ))}
                        </div>
                        {editingInstrument.content.items.map((it: string, iIdx: number) => (
                          <div key={iIdx} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
                            <span className="flex-1 text-[11px] text-gray-600 font-medium">{renderVal(it)}</span>
                            <div className="flex gap-2">
                              {(editingInstrument.content.scale || []).map((_: any, sIdx: number) => (
                                <div key={sIdx} className="w-12 h-6 border-2 border-gray-100 rounded-lg bg-gray-50/30" />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {editingInstrument.type === 'Diana de Autoevaluación' && editingInstrument.content.indicators && (
                      <div className="flex flex-col items-center justify-center p-8 space-y-10 bg-white rounded-3xl border border-gray-100 shadow-sm mt-4 min-h-[400px]">
                        <div className="relative w-80 h-80">
                          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                            {/* Concentric Circles */}
                            {[...Array(editingInstrument.content.levels || 4)].map((_, i, arr) => (
                              <circle
                                key={i}
                                cx="50"
                                cy="50"
                                r={(40 / arr.length) * (i + 1)}
                                fill="none"
                                stroke="#e2e8f0"
                                strokeWidth="0.5"
                                strokeDasharray={i === arr.length - 1 ? "" : "2,2"}
                              />
                            ))}
                            {/* Radial Lines */}
                            {editingInstrument.content.indicators.map((_: any, i: number, arr: any[]) => {
                              const angle = (i * 360) / arr.length - 90;
                              const x2 = 50 + 40 * Math.cos((angle * Math.PI) / 180);
                              const y2 = 50 + 40 * Math.sin((angle * Math.PI) / 180);
                              return (
                                <line
                                  key={i}
                                  x1="50"
                                  y1="50"
                                  x2={x2}
                                  y2={y2}
                                  stroke="#e2e8f0"
                                  strokeWidth="0.5"
                                />
                              );
                            })}
                            
                            {/* Target points for visualization (empty) */}
                            <circle cx="50" cy="50" r="1.5" fill="#e11d48" className="animate-pulse" />

                            {/* Labels on SVG */}
                            {editingInstrument.content.indicators.map((val: any, i: number, arr: any[]) => {
                              const text = typeof val === 'string' ? val : (val.label || val.description || JSON.stringify(val));
                              const angle = (i * 360) / arr.length - 90;
                              const x = 50 + 50 * Math.cos((angle * Math.PI) / 180);
                              const y = 50 + 50 * Math.sin((angle * Math.PI) / 180);
                              
                              // Simplified text for the chart area
                              const label = text.length > 15 ? text.substring(0, 12) + '...' : text;
                              
                              return (
                                <g key={i}>
                                  <text
                                    x={x}
                                    y={y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="text-[3px] font-bold fill-gray-400 uppercase"
                                    style={{ fontSize: '3px' }}
                                  >
                                    {label}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full pt-8 border-t border-gray-100">
                          {editingInstrument.content.indicators.map((val: any, i: number) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/50 border border-transparent hover:border-gray-100 transition-all">
                              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-white rounded-lg shadow-sm text-[10px] font-bold text-accent border border-gray-100">{i + 1}</span>
                              <span className="text-[11px] text-gray-600 font-medium leading-relaxed">{renderVal(val)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nombre del Instrumento</label>
                <input 
                  type="text"
                  placeholder="Ej: Rúbrica de exposición, Cuaderno de clase..."
                  value={editingInstrument.name}
                  onChange={(e) => setEditingInstrument({...editingInstrument, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all font-bold text-primary outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Tipo de Instrumento</label>
                <div className="relative">
                  <select 
                    value={editingInstrument.type || 'Otro'}
                    onChange={(e) => setEditingInstrument({...editingInstrument, type: e.target.value as any})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all font-bold text-primary outline-none appearance-none"
                  >
                    <option value="Rúbrica">Rúbrica</option>
                    <option value="Lista de Cotejo">Lista de Cotejo</option>
                    <option value="Prueba Escrita">Prueba Escrita</option>
                    <option value="Escala de Valoración">Escala de Valoración</option>
                    <option value="Diana de Autoevaluación">Diana de Autoevaluación</option>
                    <option value="Otro">Otro</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between truncate pr-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Descripción y Forma de Evaluación</label>
                </div>
                <AutoResizeTextArea 
                  placeholder="Indica qué se evalúa, los criterios implicados y cómo vas a calificar..."
                  value={editingInstrument.description}
                  onChange={(e) => setEditingInstrument({...editingInstrument, description: e.target.value})}
                  className="w-full h-40 bg-gray-50 border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all text-sm text-gray-600 leading-relaxed outline-none resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Actividades Vinculadas</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeBlock?.activities?.map((act, i) => (
                    <button
                      key={act.id}
                      onClick={() => {
                        const current = [...editingInstrument.linkedActivitiesIds];
                        const idx = current.indexOf(i.toString());
                        if (idx >= 0) current.splice(idx, 1);
                        else current.push(i.toString());
                        setEditingInstrument({...editingInstrument, linkedActivitiesIds: current});
                      }}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left group ${
                        editingInstrument.linkedActivitiesIds.includes(i.toString())
                          ? 'bg-primary/5 border-primary/20 text-primary'
                          : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        editingInstrument.linkedActivitiesIds.includes(i.toString())
                          ? 'bg-primary border-primary text-white'
                          : 'bg-transparent border-gray-200'
                      }`}>
                        {editingInstrument.linkedActivitiesIds.includes(i.toString()) && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-[11px] font-bold flex-1 truncate">Act. {i + 1}: {act.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button 
                onClick={() => setEditingInstrument(null)}
                className="flex-1 py-4 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-gray-100 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveInstrument}
                disabled={!editingInstrument.name || !editingInstrument.description}
                className="flex-[2] py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 disabled:opacity-50 transition-all shadow-xl shadow-primary/20"
              >
                Guardar Instrumento
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer Info Mobile Only or floating */}
      <div className="md:hidden p-4 bg-white border-t border-gray-200">
        <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest">Kerygma APP</p>
      </div>

      <AddGroupModal 
        isOpen={showAddGroupModal} 
        onClose={() => {
          setShowAddGroupModal(false);
          setEditingGroupId(null);
        }} 
        onSave={handleSaveGroup} 
        existingSchools={Array.from(new Set(studentGroups.map(g => g.school)))}
        editingGroup={editingGroupId ? studentGroups.find(g => g.id === editingGroupId) : null}
      />
      </div>
    </APIProvider>
  );
}
