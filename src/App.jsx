import React, { useState } from 'react';

const GitNode = ({ cx, cy, color, name, branch, desc, onMouseEnter, onMouseMove, onMouseLeave }) => (
  <g
    className="group cursor-pointer"
    onMouseEnter={onMouseEnter(name, branch, desc, color)}
    onMouseMove={onMouseMove}
    onMouseLeave={onMouseLeave}
  >
    <circle cx={cx} cy={cy} r="22" fill={color} opacity="0.1" filter="url(#glow-sm)" />
    <circle className="opacity-0 group-hover:opacity-80 transition-opacity duration-200" cx={cx} cy={cy} r="21" fill="none" stroke={color} strokeWidth="2.5" />
    <circle cx={cx} cy={cy} r="14" fill="#1c2128" stroke={color} strokeWidth="2.8" />
    <circle cx={cx} cy={cy} r="5" fill={color} />
  </g>
);

export default function App() {
  // Configurações de grade MANTIDAS (Eixo X e Y do fluxo correto)
  const cols = {
    c1: 140, // Feature
    c2: 280, // Hotfix
    c3: 420, // Development
    c4: 560, // Staging
    c5: 700, // Release
    c6: 840, // Main
  };

  const rows = {
    header: 50,
    r1: 150, // Feature / Main 1.0
    r2: 250, // Hotfix
    r3: 350, // Development
    r4: 450, // Staging
    r5: 550, // Release
    r6: 650, // Main 1.1
  };

  // Cores atualizadas para a paleta elegante (Tema Escuro / GitHub)
  const colors = {
    feature: '#f85149',
    hotfix: '#d29922',
    development: '#3fb950',
    staging: '#58a6ff',
    release: '#8957e5',
    main: '#8b949e',
  };

  const nodeRadius = 18;
  // Aumentei o offset para dar espaço e as linhas não sobreporem o triângulo da seta
  const arrOffset = 28; 

  // Estados
  const [tip, setTip] = useState({ visible: false, x: 0, y: 0, name: '', branch: '', desc: '', color: '' });
  const [taskName, setTaskName] = useState('');
  const [workType, setWorkType] = useState('feature');
  const [copiedCmd, setCopiedCmd] = useState(null);

  // Manipuladores de Tooltip
  const handleMouseMove = (e) => setTip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
  const handleMouseEnter = (name, branch, desc, color) => (e) => setTip({ visible: true, x: e.clientX, y: e.clientY, name, branch, desc, color });
  const handleMouseLeave = () => setTip((prev) => ({ ...prev, visible: false }));

  // Lógica da Ferramenta de Comandos Git
  const safeName = taskName.trim().replace(/\s+/g, '-') || 'numero-do-card';
  const branchName = `${workType}/${safeName}`;
  
  const handleCopy = (text) => {
    try {
      navigator.clipboard.writeText(text);
    } catch (e) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const commands = [
    { label: "1. Criar e entrar na branch", cmd: `git checkout -b ${branchName} main` },
    { label: "2. Publicar no repositório remoto", cmd: `git push -u origin ${branchName}` },
    { label: "3. Atualizar branch com a Main (Rebase)", cmd: `git fetch origin && git rebase origin/main` },
  ];

  // Componente utilitário para definir os marcadores de setas
  const ArrowMarkers = () => (
    <defs>
      {Object.entries(colors).map(([key, color]) => (
        <marker
          key={key}
          id={`arrow-${key}`}
          markerWidth="8"
          markerHeight="8"
          viewBox="0 0 10 10"
          refX="0"
          refY="5"
          orient="auto"
        >
          <path d="M0,1.5 L8,5 L0,8.5Z" fill={color} />
        </marker>
      ))}
      <filter id="glow-sm" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
      </filter>
    </defs>
  );

  // GitNode is defined outside App to prevent remounting on state changes

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col items-center p-8 font-mono text-[#e6edf3]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
          @keyframes flow { to { stroke-dashoffset: -20; } }
          .flow-path { animation: flow 1.1s linear infinite; }
        `}
      </style>

      {/* Header e Legenda */}
      <div className="mb-8 text-center flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span style={{ color: '#8b949e' }}>⎇</span> Git Flow
        </h1>
        <p className="text-[0.68rem] text-[#6e7681] uppercase tracking-[0.1em] mb-8">
          Visualização do ciclo de vida das branches
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          {Object.entries(colors).map(([key, color]) => (
            <div key={key} className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161b22] border border-[#21262d] text-[0.67rem] text-[#8b949e] capitalize hover:text-white transition-colors cursor-default">
              <div className="w-[9px] h-[9px] rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 7px ${color}` }}></div>
              {key}
            </div>
          ))}
        </div>
      </div>

      {/* Wrap Principal SVG */}
      <div className="w-full max-w-6xl bg-[#161b22] border border-[#21262d] rounded-2xl p-8 overflow-x-auto shadow-2xl">
        <svg viewBox="0 0 1000 750" className="w-full h-auto min-w-[800px]">
          <ArrowMarkers />

          {/* ================= LANE BACKGROUNDS (Colunas) ================= */}
          <g>
            <rect x={cols.c1 - 55} y={15} width="110" height="710" rx="6" fill={colors.feature} fillOpacity="0.04" />
            <rect x={cols.c2 - 55} y={15} width="110" height="710" rx="6" fill={colors.hotfix} fillOpacity="0.04" />
            <rect x={cols.c3 - 55} y={15} width="110" height="710" rx="6" fill={colors.development} fillOpacity="0.04" />
            <rect x={cols.c4 - 55} y={15} width="110" height="710" rx="6" fill={colors.staging} fillOpacity="0.04" />
            <rect x={cols.c5 - 55} y={15} width="110" height="710" rx="6" fill={colors.release} fillOpacity="0.04" />
            <rect x={cols.c6 - 55} y={15} width="110" height="710" rx="6" fill={colors.main} fillOpacity="0.05" />
          </g>

          {/* ================= HEADERS (Pills no topo das colunas) ================= */}
          <g>
            {Object.entries(cols).map(([key, xPos], i) => {
              const titles = ['Feature', 'Hotfix', 'Development', 'Staging', 'Release', 'Main'];
              const cKeys = Object.keys(colors);
              const color = colors[cKeys[i]];
              
              return (
                <g key={key}>
                  <rect x={xPos - 50} y={rows.header - 25} width="100" height="26" rx="13" fill="#0d1117" stroke="#30363d" strokeWidth="1" />
                  <circle cx={xPos - 37} cy={rows.header - 12} r="4.5" fill={color} />
                  <text x={xPos - 25} y={rows.header - 12} fill="#8b949e" fontSize="10" fontWeight="500" dominantBaseline="central">{titles[i]}</text>
                </g>
              );
            })}
          </g>

          {/* ================= BACKGROUND PATHS ANIMADOS ================= */}
          <g fill="none" strokeWidth="1.9" strokeDasharray="6,4" className="flow-path opacity-70">
            
            {/* TRILHAS GRAY (Main) */}
            <g stroke={colors.main}>
              <path d={`M ${cols.c6} ${rows.r1} L ${cols.c1 + arrOffset} ${rows.r1}`} markerEnd="url(#arrow-main)" />
              <path d={`M ${cols.c2} ${rows.r1} L ${cols.c2} ${rows.r2 - arrOffset}`} markerEnd="url(#arrow-main)" />
              <path d={`M ${cols.c3} ${rows.r1} L ${cols.c3} ${rows.r3 - arrOffset}`} markerEnd="url(#arrow-main)" />
              <path d={`M ${cols.c4} ${rows.r1} L ${cols.c4} ${rows.r4 - arrOffset}`} markerEnd="url(#arrow-main)" />
              <path d={`M ${cols.c5} ${rows.r1} L ${cols.c5} ${rows.r5 - arrOffset}`} markerEnd="url(#arrow-main)" />
              <path d={`M ${cols.c6} ${rows.r1 + nodeRadius} L ${cols.c6} ${rows.r6 - arrOffset}`} markerEnd="url(#arrow-main)" />
            </g>

            {/* TRILHAS RED (Feature) */}
            <g stroke={colors.feature}>
              <path d={`M ${cols.c1} ${rows.r1 + nodeRadius} L ${cols.c1} ${rows.r5}`} />
              <path d={`M ${cols.c1} ${rows.r3 + 6} L ${cols.c3 - arrOffset} ${rows.r3 + 6}`} markerEnd="url(#arrow-feature)" />
              <path d={`M ${cols.c1} ${rows.r4 + 6} L ${cols.c4 - arrOffset} ${rows.r4 + 6}`} markerEnd="url(#arrow-feature)" />
              <path d={`M ${cols.c1} ${rows.r5} L ${cols.c5 - arrOffset} ${rows.r5}`} markerEnd="url(#arrow-feature)" />
            </g>

            {/* TRILHAS YELLOW (Hotfix) */}
            <g stroke={colors.hotfix}>
              <path d={`M ${cols.c2} ${rows.r2 + nodeRadius} L ${cols.c2} ${rows.r6}`} />
              <path d={`M ${cols.c2} ${rows.r3 - 8} L ${cols.c3 - arrOffset} ${rows.r3 - 8}`} markerEnd="url(#arrow-hotfix)" />
              <path d={`M ${cols.c2} ${rows.r4 - 8} L ${cols.c4 - arrOffset} ${rows.r4 - 8}`} markerEnd="url(#arrow-hotfix)" />
              <path d={`M ${cols.c2} ${rows.r6 + 8} L ${cols.c6 - arrOffset} ${rows.r6 + 8}`} markerEnd="url(#arrow-hotfix)" />
            </g>

            {/* TRILHA PURPLE (Release) */}
            <g stroke={colors.release}>
              <path d={`M ${cols.c5} ${rows.r5 + nodeRadius} L ${cols.c5} ${rows.r6 - 8} L ${cols.c6 - arrOffset} ${rows.r6 - 8}`} markerEnd="url(#arrow-release)" />
            </g>
          </g>

          {/* ================= TEXT LABELS (Badges) ================= */}
          <g>
            <rect x={cols.c6 + 32} y={rows.r1 - 11} width="66" height="22" rx="4" fill="#21262d" stroke="#6e7681" strokeWidth="1" />
            <text x={cols.c6 + 65} y={rows.r1} fill="#8b949e" fontSize="10.5" fontWeight="600" textAnchor="middle" dominantBaseline="central">Tag v1.0</text>

            <text x={cols.c1 - 28} y={rows.r1} fill={colors.feature} fontSize="11" fontWeight="600" textAnchor="end" dominantBaseline="central">feature/<tspan fill="#8b949e" fontWeight="400">#243</tspan></text>
            <text x={cols.c2 - 28} y={rows.r2} fill={colors.hotfix} fontSize="11" fontWeight="600" textAnchor="end" dominantBaseline="central">hotfix/<tspan fill="#8b949e" fontWeight="400">#381</tspan></text>

            <rect x={cols.c6 + 32} y={rows.r6 - 11} width="66" height="22" rx="4" fill="#21262d" stroke="#6e7681" strokeWidth="1" />
            <text x={cols.c6 + 65} y={rows.r6} fill="#8b949e" fontSize="10.5" fontWeight="600" textAnchor="middle" dominantBaseline="central">Tag v1.1</text>
          </g>

          {/* ================= NODES ================= */}
          <GitNode cx={cols.c6} cy={rows.r1} color={colors.main} name="Tag v1.0" branch="Main" desc="Versão base — origem das branches" onMouseEnter={handleMouseEnter} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />
          <GitNode cx={cols.c1} cy={rows.r1} color={colors.feature} name="feature/1234" branch="Feature" desc="Nova funcionalidade em desenvolvimento" onMouseEnter={handleMouseEnter} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />
          <GitNode cx={cols.c2} cy={rows.r2} color={colors.hotfix} name="hotfix/4312" branch="Hotfix" desc="Correção urgente de bug em produção" onMouseEnter={handleMouseEnter} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />
          <GitNode cx={cols.c3} cy={rows.r3} color={colors.development} name="Development" branch="Development" desc="Integração de features e hotfixes" onMouseEnter={handleMouseEnter} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />
          <GitNode cx={cols.c4} cy={rows.r4} color={colors.staging} name="Staging" branch="Staging" desc="Ambiente de homologação e testes" onMouseEnter={handleMouseEnter} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />
          <GitNode cx={cols.c5} cy={rows.r5} color={colors.release} name="Release" branch="Release" desc="Candidato a deploy em produção" onMouseEnter={handleMouseEnter} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />
          <GitNode cx={cols.c6} cy={rows.r6} color={colors.main} name="Tag v1.1" branch="Main" desc="Nova versão estável em produção" onMouseEnter={handleMouseEnter} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />
          
        </svg>
      </div>

      {/* ================= TOOLTIP ================= */}
      {tip.visible && (
        <div
          className="fixed z-50 pointer-events-none bg-[#1c2128] border border-[#30363d] rounded-lg px-4 py-3 shadow-[0_6px_24px_rgba(0,0,0,0.45)]"
          style={{ left: `${tip.x + 16}px`, top: `${tip.y - 10}px`, transition: 'opacity 0.1s' }}
        >
          <div className="text-xs font-semibold mb-1 flex items-center gap-1.5" style={{ color: tip.color }}>
            <span>⬤</span> {tip.name}
          </div>
          <div className="text-[0.65rem] text-[#8b949e]">
            {tip.branch} · {tip.desc}
          </div>
        </div>
      )}

      {/* ================= FERRAMENTAS PARA DESENVOLVEDORES ================= */}
      <div className="w-full max-w-6xl mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Painel de Configuração */}
        <div className="bg-[#161b22] border border-[#21262d] rounded-2xl p-6 shadow-xl lg:col-span-1">
          <h2 className="text-sm font-semibold text-[#e6edf3] mb-5 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8b949e]">
              <polyline points="4 17 10 11 4 5"></polyline>
              <line x1="12" y1="19" x2="20" y2="19"></line>
            </svg>
            Gerador de Comandos
          </h2>
          
          <div className="mb-4">
            <label className="block text-[#8b949e] text-xs font-semibold mb-2">TIPO DE ATIVIDADE</label>
            <div className="flex bg-[#0d1117] border border-[#30363d] rounded-lg p-1">
              <button 
                className={`flex-1 py-1.5 text-xs rounded-md font-medium transition-colors ${workType === 'feature' ? 'bg-[#21262d] text-white shadow-sm' : 'text-[#8b949e] hover:text-[#e6edf3]'}`}
                onClick={() => setWorkType('feature')}
              >
                Feature
              </button>
              <button 
                className={`flex-1 py-1.5 text-xs rounded-md font-medium transition-colors ${workType === 'hotfix' ? 'bg-[#21262d] text-white shadow-sm' : 'text-[#8b949e] hover:text-[#e6edf3]'}`}
                onClick={() => setWorkType('hotfix')}
              >
                Hotfix
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[#8b949e] text-xs font-semibold mb-2">IDENTIFICADOR (CARD/TAREFA)</label>
            <input
              type="text"
              placeholder="Ex: card-78569"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] text-[#e6edf3] text-sm rounded-lg px-3 py-2 outline-none focus:border-[#58a6ff] transition-colors placeholder-[#484f58]"
            />
          </div>
        </div>

        {/* Comandos Gerados */}
        <div className="bg-[#161b22] border border-[#21262d] rounded-2xl p-6 shadow-xl lg:col-span-2">
          <div className="space-y-4">
            {commands.map((item, index) => (
              <div key={index}>
                <label className="block text-[#8b949e] text-[0.68rem] uppercase tracking-wider mb-1.5">{item.label}</label>
                <div className="flex items-center justify-between bg-[#0d1117] border border-[#30363d] rounded-lg p-3 group hover:border-[#484f58] transition-colors">
                  <code className="text-[#e6edf3] text-xs font-mono truncate mr-4">
                    {item.cmd}
                  </code>
                  <button 
                    onClick={() => handleCopy(item.cmd)} 
                    className="text-[#6e7681] hover:text-white transition-colors flex-shrink-0"
                    title="Copiar comando"
                  >
                    {copiedCmd === item.cmd ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
