import { useState, useRef } from 'react'
import {
  Bold, Italic, Underline, List, ListOrdered, Link2, Image, Code,
  Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight,
  Undo2, Redo2, Trash2
} from 'lucide-react'

const FORMATTING_TOOLS = [
  { id: 'bold', label: 'Gras', icon: Bold, command: 'bold' },
  { id: 'italic', label: 'Italique', icon: Italic, command: 'italic' },
  { id: 'underline', label: 'Souligné', icon: Underline, command: 'underline' },
  { id: 'h1', label: 'Titre 1', icon: Heading1, command: 'formatBlock', value: 'h1' },
  { id: 'h2', label: 'Titre 2', icon: Heading2, command: 'formatBlock', value: 'h2' },
  { id: 'h3', label: 'Titre 3', icon: Heading3, command: 'formatBlock', value: 'h3' },
  { id: 'ul', label: 'Liste', icon: List, command: 'insertUnorderedList' },
  { id: 'ol', label: 'Liste numérotée', icon: ListOrdered, command: 'insertOrderedList' },
  { id: 'alignLeft', label: 'Aligner à gauche', icon: AlignLeft, command: 'justifyLeft' },
  { id: 'alignCenter', label: 'Centrer', icon: AlignCenter, command: 'justifyCenter' },
  { id: 'alignRight', label: 'Aligner à droite', icon: AlignRight, command: 'justifyRight' },
  { id: 'code', label: 'Code', icon: Code, command: 'formatBlock', value: 'pre' },
]

export default function RichTextEditor({ value, onChange, placeholder = 'Écrivez votre contenu...' }) {
  const editorRef = useRef(null)
  const [history, setHistory] = useState([value])
  const [historyIndex, setHistoryIndex] = useState(0)

  const handleCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const handleInput = (e) => {
    const newValue = e.currentTarget.innerHTML
    onChange(newValue)
    
    // Update history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newValue)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      editorRef.current.innerHTML = history[newIndex]
      onChange(history[newIndex])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      editorRef.current.innerHTML = history[newIndex]
      onChange(history[newIndex])
    }
  }

  const handleAddLink = () => {
    const url = prompt('Entrez l\'URL :')
    if (url) {
      handleCommand('createLink', url)
    }
  }

  const handleAddImage = () => {
    const url = prompt('Entrez l\'URL de l\'image :')
    if (url) {
      handleCommand('insertImage', url)
    }
  }

  const handleClear = () => {
    if (confirm('Êtes-vous sûr de vouloir effacer tout le contenu ?')) {
      editorRef.current.innerHTML = ''
      onChange('')
      setHistory([''])
      setHistoryIndex(0)
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-3 flex flex-wrap gap-1">
        {/* Undo/Redo */}
        <div className="flex gap-1 border-r border-gray-300 pr-2">
          <button
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className="p-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            title="Annuler"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex === history.length - 1}
            className="p-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            title="Refaire"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Formatting Tools */}
        {FORMATTING_TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <button
              key={tool.id}
              onClick={() => handleCommand(tool.command, tool.value)}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title={tool.label}
            >
              <Icon className="w-4 h-4" />
            </button>
          )
        })}

        {/* Link & Image */}
        <div className="flex gap-1 border-l border-gray-300 pl-2">
          <button
            onClick={handleAddLink}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Ajouter un lien"
          >
            <Link2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleAddImage}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Ajouter une image"
          >
            <Image className="w-4 h-4" />
          </button>
        </div>

        {/* Clear */}
        <div className="flex gap-1 border-l border-gray-300 pl-2 ml-auto">
          <button
            onClick={handleClear}
            className="p-2 hover:bg-red-100 text-red-600 rounded transition-colors"
            title="Effacer tout"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
        className="w-full min-h-96 p-4 focus:outline-none text-gray-800 bg-white"
        style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
        dangerouslySetInnerHTML={{ __html: value }}
      />

      {/* Character Count */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 text-xs text-gray-500">
        {value.replace(/<[^>]*>/g, '').length} caractères
      </div>
    </div>
  )
}
