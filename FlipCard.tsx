import { cn } from '@/lib/utils';

interface FlipCardProps {
  isFlipped: boolean;
  onClick: () => void;
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
}

export function FlipCard({
  isFlipped,
  onClick,
  frontContent,
  backContent,
  className,
}: FlipCardProps) {
  return (
    <div
      className={cn(
        'relative w-full aspect-[4/3] cursor-pointer perspective-1000',
        className
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          'relative w-full h-full transition-transform duration-500 preserve-3d',
          isFlipped && 'rotate-y-180'
        )}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-white to-muted border-2 border-primary/20 shadow-xl shadow-primary/10 flex flex-col">
            {frontContent}
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-accent/20 shadow-xl shadow-accent/10 flex flex-col">
            {backContent}
          </div>
        </div>
      </div>
    </div>
  );
}
