import { Tool } from '../types';

interface ToolsGridProps {
  tools: Tool[];
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
}

export const ToolsGrid = ({ tools, selectedTool, onToolSelect }: ToolsGridProps) => {
  return (
    <div className="grid tools-grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 px-4 sm:px-6">
      {tools.map((tool) => (
        <button
          key={tool.id}
          className={`tool-button bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl flex flex-col items-center gap-4 border ${
            selectedTool === tool.id 
            ? 'active border-cyan-400/50' 
            : 'border-slate-700/50 hover:border-cyan-400/50'
          }`}
          onClick={() => onToolSelect(tool.id)}
        >
          <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 rounded-xl">
            {tool.icon}
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-white">{tool.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {tool.description}
            </p>
          </div>
          <span className="mt-3 px-4 py-1.5 bg-cyan-500/10 rounded-full text-cyan-400 text-sm font-medium">
            Try Now →
          </span>
        </button>
      ))}
    </div>
  );
}; 