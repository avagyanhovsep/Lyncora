type OverlayProps = {
    onClose: () => void;
    children: React.ReactNode;
};

export default function ChatOverlay({ onClose, children }: OverlayProps) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            <button
                type="button"
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
                aria-label="Close"
            />
            {children}
        </div>
    );
}
