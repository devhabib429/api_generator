import { useState } from 'react';
import { Field } from '@/lib/types';

interface ApiFormProps {
  endpoint: string;
  setEndpoint: (value: string) => void;
  fields: Field[];
  setFields: (fields: Field[]) => void;
  count: number;
  setCount: (count: number) => void;
  onGenerate: () => void;
}

export default function ApiForm({
  endpoint,
  setEndpoint,
  fields,
  setFields,
  count,
  setCount,
  onGenerate,
}: ApiFormProps) {
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('string');

  return (
    <div className="space-y-8 md:space-y-12 relative px-4 md:px-0">
      {/* Decorative Elements */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-300"></div>

      {/* Form Title */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 animate-gradient">
          Configure Your API
        </h2>
        <p className="mt-2 text-sm md:text-base text-white/60">Design your custom API endpoint with dynamic data fields</p>
      </div>

      {/* Endpoint Input */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-cyan-500 rounded-full animate-pulse"></div>
          <label className="text-white/70 font-medium">API Endpoint</label>
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100"></div>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-white/30 font-mono group-hover:text-white/50 transition-colors">/api/</span>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value.toLowerCase())}
              placeholder="users"
              className="w-full bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 pl-14
                       text-white placeholder-white/20 font-mono
                       focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10
                       transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Field Configuration */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse"></div>
            <label className="text-white/70 font-medium">Fields</label>
          </div>
          <span className="text-white/30 text-sm">{fields.length} field(s) added</span>
        </div>
        
        {/* Field Input */}
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            placeholder="Field name"
            className="flex-1 w-full md:w-auto bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3
                     text-white placeholder-white/20
                     focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10
                     transition-all duration-300"
          />
          <select
            value={newFieldType}
            onChange={(e) => setNewFieldType(e.target.value)}
            className="w-full md:w-auto bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3
                     text-white appearance-none
                     focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10
                     transition-all duration-300"
          >
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="email">Email</option>
          </select>
          <button
            onClick={() => {
              if (newFieldName) {
                setFields([...fields, { name: newFieldName, type: newFieldType }]);
                setNewFieldName('');
              }
            }}
            className="relative group overflow-hidden bg-gradient-to-r from-purple-500/20 to-blue-500/20 
                     hover:from-purple-500/30 hover:to-blue-500/30 border border-white/10 rounded-xl p-3
                     transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 text-white/70 group-hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </span>
          </button>
        </div>

        {/* Fields List */}
        <div className="space-y-2 mt-4">
          {fields.map((field, index) => (
            <div
              key={index}
              className="group flex items-center justify-between bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4
                       hover:bg-white/5 hover:border-purple-500/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-purple-500 rounded-full group-hover:animate-pulse"></div>
                <span className="text-white font-medium">{field.name}</span>
                <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded-md text-xs">
                  {field.type}
                </span>
              </div>
              <button
                onClick={() => setFields(fields.filter((_, i) => i !== index))}
                className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400
                         transition-all duration-300 hover:scale-110 active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Count Input */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
          <label className="text-white/70 font-medium">Number of Records</label>
        </div>
        <input
          type="number"
          min="1"
          max="100"
          value={count}
          onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
          className="w-full bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3
                   text-white placeholder-white/20
                   focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10
                   transition-all duration-300"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={!endpoint || fields.length === 0}
        className={`w-full relative group overflow-hidden rounded-xl py-4 font-medium text-lg
                   ${!endpoint || fields.length === 0
                     ? 'bg-white/5 text-white/30 cursor-not-allowed'
                     : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
                   } transition-all duration-500`}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Generate API
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </button>
    </div>
  );
} 