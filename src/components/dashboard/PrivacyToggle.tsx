
export const PrivacyToggle = () => {
  return (
    <div className="flex items-center">
      <label htmlFor="private-mode" className="flex items-center cursor-pointer gap-2 text-sm">
        <div className="relative">
          <input type="checkbox" id="private-mode" className="sr-only" />
          <div className="block h-6 w-11 rounded-full bg-muted"></div>
          <div className="dot absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition"></div>
        </div>
        <div>
          <div className="font-medium">Private Mode</div>
          <div className="text-xs text-muted-foreground">Keep files in memory only</div>
        </div>
      </label>
    </div>
  );
};
