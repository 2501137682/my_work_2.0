import { useEffect, useRef, useState } from "react";
import { ExternalLink, LoaderCircle, Maximize2 } from "lucide-react";

export default function LiveFrame({ title, url, embedUrl, variant = "desktop", eager = false }) {
  const rootRef = useRef(null);
  const [active, setActive] = useState(eager);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (eager || !rootRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
        if (!entry.isIntersecting) setLoaded(false);
      },
      { rootMargin: "350px 0px" },
    );
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [eager]);

  return (
    <div className={`live-frame live-frame--${variant}`} ref={rootRef}>
      <div className="live-frame__bar">
        <div className="window-dots" aria-hidden="true"><span /><span /><span /></div>
        <span className="live-frame__title">{title}</span>
        <a href={url} target="_blank" rel="noreferrer" aria-label={`在新窗口打开 ${title}`} title="在新窗口打开">
          <ExternalLink size={16} />
        </a>
      </div>
      <div className="live-frame__viewport">
        {!loaded && <div className="frame-loader"><LoaderCircle size={22} /><span>正在接入实时页面</span></div>}
        {active && (
          <iframe
            src={embedUrl ?? url}
            title={title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            allow="autoplay; fullscreen; clipboard-read; clipboard-write"
          />
        )}
        <a className="frame-expand" href={url} target="_blank" rel="noreferrer" title="全屏查看">
          <Maximize2 size={16} />
        </a>
      </div>
    </div>
  );
}
