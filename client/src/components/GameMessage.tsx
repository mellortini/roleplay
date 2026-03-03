import { SocketMessage } from '../types';

interface GameMessageProps {
  message: SocketMessage;
}

const getMessageClass = (type: SocketMessage['type']) => {
  switch (type) {
    case 'CHAT':
      return 'message-chat';
    case 'ACTION':
      return 'message-action';
    case 'NARRATION':
      return 'message-narration';
    case 'NPC_DIALOGUE':
      return 'message-npc';
    case 'SYSTEM':
      return 'message-system';
    case 'COMBAT':
      return 'message-combat';
    default:
      return 'message-chat';
  }
};

const getMessageLabel = (type: SocketMessage['type'], isAiGenerated?: boolean) => {
  const aiBadge = isAiGenerated ? '🤖 ' : '';
  switch (type) {
    case 'CHAT':
      return '';
    case 'ACTION':
      return '[AKCJA]';
    case 'NARRATION':
      return `${aiBadge}[NARRACJA]`;
    case 'NPC_DIALOGUE':
      return `${aiBadge}[NPC]`;
    case 'SYSTEM':
      return '[SYSTEM]';
    case 'COMBAT':
      return '[WALKa]';
    default:
      return '';
  }
};

export const GameMessageComponent = ({ message }: GameMessageProps) => {
  const timestamp = new Date(message.timestamp).toLocaleTimeString('pl-PL');
  
  return (
    <div className={`py-2 px-3 rounded-lg animate-fade-in ${getMessageClass(message.type)}`}>
      <div className="flex items-baseline space-x-2">
        {getMessageLabel(message.type, message.isAiGenerated) && (
          <span className="text-xs opacity-70">{getMessageLabel(message.type, message.isAiGenerated)}</span>
        )}
        {message.author && (
          <span className="font-medium text-primary-400">{message.author.name}:</span>
        )}
        <span className="text-xs text-gray-500 ml-auto">{timestamp}</span>
      </div>
      <div className="mt-1 whitespace-pre-wrap">{message.content}</div>
    </div>
  );
};
