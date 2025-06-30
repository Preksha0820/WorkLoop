import React, { useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Underline from '@tiptap/extension-underline'

import {
  FaBold, FaItalic, FaUnderline, FaStrikethrough,
  FaListUl, FaListOl, FaTable, FaEraser
} from 'react-icons/fa'
import { MdFormatColorText } from 'react-icons/md'

export default function TiptapEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value])

  const [showTablePopup, setShowTablePopup] = useState(false)
  const [selectedRows, setSelectedRows] = useState(2)
  const [selectedCols, setSelectedCols] = useState(2)
  const popupRef = useRef()

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowTablePopup(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const buttonClass = (active) =>
    `flex items-center justify-center gap-1 px-2 py-1 border rounded-md text-sm transition ${
      active
        ? 'bg-blue-100 text-blue-700 border-blue-400'
        : 'bg-white text-gray-800 border-gray-500 hover:bg-gray-200'
    }`

  const insertTableButton = (
  <div className="relative" ref={popupRef}>
    <button
      type="button"
      className={buttonClass(false)}
      onClick={() => setShowTablePopup(!showTablePopup)}
      title="Insert Table"
    >
      <FaTable />
    </button>

    {showTablePopup && (
      <div className="absolute z-10 top-10 left-0 bg-white p-3 border border-gray-400 rounded-lg shadow min-w-[220px]">
        <div className="mb-2 text-sm font-semibold text-gray-700">Select Table Size</div>

        {/* Hover Grid */}
        <div className="grid gap-1 mb-3">
          {[...Array(5)].map((_, r) => (
            <div key={r} className="flex gap-1">
              {[...Array(5)].map((_, c) => {
                const isSelected = r < selectedRows && c < selectedCols
                return (
                  <div
                    key={c}
                    onMouseEnter={() => {
                      setSelectedRows(r + 1)
                      setSelectedCols(c + 1)
                    }}
                    onClick={() => {
                      editor
                        .chain()
                        .focus()
                        .insertTable({ rows: r + 1, cols: c + 1, withHeaderRow: true })
                        .run()
                      setShowTablePopup(false)
                    }}
                    className={`w-6 h-6 border ${
                      isSelected ? 'bg-blue-500' : 'bg-gray-200'
                    } cursor-pointer hover:bg-blue-300 transition`}
                  />
                )
              })}
            </div>
          ))}
        </div>

        {/* Table Preview */}
        <div className="text-xs text-gray-500 mb-2">
          {selectedRows} × {selectedCols} Table
        </div>
        <div className="overflow-auto border border-gray-300 rounded">
          <table className="table-auto w-full border-collapse text-xs">
            <tbody>
              {Array.from({ length: selectedRows }).map((_, rIdx) => (
                <tr key={rIdx}>
                  {Array.from({ length: selectedCols }).map((_, cIdx) => (
                    <td
                      key={cIdx}
                      className="border border-gray-400 p-2 text-center"
                      style={{ minWidth: '40px', height: '30px' }}
                    >
                      &nbsp;
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
)

  const toolbarButtons = [
    { icon: <FaBold />, action: () => editor.chain().focus().toggleBold().run(), label: 'Bold', check: 'bold' },
    { icon: <FaItalic />, action: () => editor.chain().focus().toggleItalic().run(), label: 'Italic', check: 'italic' },
    { icon: <FaUnderline />, action: () => editor.chain().focus().toggleUnderline().run(), label: 'Underline', check: 'underline' },
    { icon: <FaStrikethrough />, action: () => editor.chain().focus().toggleStrike().run(), label: 'Strike', check: 'strike' },
    { icon: <FaListUl />, action: () => editor.chain().focus().toggleBulletList().run(), label: 'Bullet List', check: 'bulletList' },
    { icon: <FaListOl />, action: () => editor.chain().focus().toggleOrderedList().run(), label: 'Numbered List', check: 'orderedList' },
    {
      icon: <MdFormatColorText />,
      action: () => editor.chain().focus().setColor('#dc2626').run(),
      label: 'Red Text',
      check: '',
    },
    {
      icon: <FaEraser />,
      action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
      label: 'Clear Formatting',
      check: '',
    },
  ]

  return (
    <div className="border border-gray-500 rounded-lg bg-white shadow-sm">
      <div className="flex flex-wrap gap-2 border-b border-gray-500 p-3 bg-gray-100 rounded-t-lg">
        {toolbarButtons.map((btn, idx) => (
          <button
            key={idx}
            type="button"
            className={buttonClass(btn.check && editor.isActive(btn.check))}
            onClick={btn.action}
            title={btn.label}
          >
            {btn.icon}
          </button>
        ))}
        {insertTableButton}
      </div>

      <EditorContent
        editor={editor}
        className="p-4 min-h-[150px] outline-none prose max-w-full border-t border-gray-400"
      />
    </div>
  )
}
