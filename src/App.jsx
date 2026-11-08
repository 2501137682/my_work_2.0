import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Github, Menu, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";
import LiveFrame from "./components/LiveFrame";
import KineticHero from "./components/KineticHero";
import { dataProjects, editClips, vibeProjects, visualFilms } from "./content";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP);

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const chapters = [
  ["data", "数据与可视化"],
  ["visual", "摄影与视觉"],
  ["vibe", "Vibe Coding"],
  ["interest", "兴趣与硬件"],
];

function SectionHead({ index, eyebrow, title, note }) {
  return (
    <header className="section-head reveal">
      <span className="section-index">{index}</span>
      <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>
      <p className="section-note">{note}</p>
    </header>
  );
}

function VideoCard({ item, index }) {
  return (
    <article className={`film-card reveal ${index === 0 ? "film-card--wide" : ""}`}>
      <div className="film-media">
        <video controls preload="none" poster={assetUrl(`media/posters/${item.file}.webp`)}>
          <source src={assetUrl(`source/${item.file}`)} type="video/mp4" />
        </video>
      </div>
      <div className="film-meta"><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.note}</p></div>
    </article>
  );
}

export default function App() {
  const appRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.from(el, {
          y: 48,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        });
      });
    });
    return () => mm.revert();
  }, { scope: appRef });

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 821px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        let lastWheelAt = -Infinity;
        const onWheel = (event) => {
          if (event.ctrlKey || Math.abs(event.deltaY) < 2) return;
          event.preventDefault();

          const now = performance.now();
          const startsNewGesture = now - lastWheelAt > 160;
          lastWheelAt = now;
          if (!startsNewGesture) return;

          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const destination = gsap.utils.clamp(0, maxScroll, window.scrollY + Math.sign(event.deltaY) * window.innerHeight);
          if (Math.abs(destination - window.scrollY) < 2) return;

          gsap.to(window, {
            scrollTo: { y: destination, autoKill: false },
            duration: 0.52,
            ease: "power2.out",
            overwrite: true,
          });
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        return () => {
          window.removeEventListener("wheel", onWheel);
          gsap.killTweensOf(window);
        };
      },
    );
    return () => mm.revert();
  }, { scope: appRef });

  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  const goTo = (id) => {
    const target = document.getElementById(id);
    if (target) {
      gsap.to(window, {
        scrollTo: { y: target, autoKill: false },
        duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.62,
        ease: "power2.out",
        overwrite: true,
      });
    }
    setMenuOpen(false);
  };

  return (
    <div ref={appRef}>
      <a className="skip-link" href="#main">跳至主要内容</a>
      <nav className="site-nav">
        <button className="wordmark" onClick={() => goTo("top")} aria-label="返回顶部">CYR<span>®</span></button>
        <div className={`nav-links ${menuOpen ? "is-open" : ""}`}>
          {chapters.map(([id, label], i) => <button key={id} onClick={() => goTo(id)}><span>0{i + 1}</span>{label}</button>)}
        </div>
        <button className="nav-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="打开导航" title="导航">{menuOpen ? <X /> : <Menu />}</button>
      </nav>

      <main id="main">
        <KineticHero onExplore={() => goTo("data")} />

        <section className="data-section" id="data">
          <div className="signal-grid data-intro" aria-hidden="true"><i className="signal-grid__scan" /></div>
          <div className="wrap">
            <SectionHead index="01" eyebrow="DATA / INSIGHT" title="数据处理 数据可视化方面的能力展示" note="从资料采集、分析逻辑到可视化表达" />
            <div className="data-projects">
              {dataProjects.map((project) => (
                <article className="data-project reveal" key={project.title}>
                  <div className="data-copy">
                    <span>{project.number}</span><h3>{project.title}</h3><p className="data-subtitle">{project.subtitle}</p><p>{project.summary}</p>
                    <div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  </div>
                  <LiveFrame title={project.title} url={project.url} embedUrl={project.embedUrl} />
                </article>
              ))}
            </div>
            <article className="workflow-strip reveal">
              <div><span>04 / AUTOMATION</span><h3>微信公众号自动发布工作流</h3><p>基于 n8n 组织内容生成、处理与发布节点，将重复操作转化为可复用的自动化流程。</p></div>
              <img src={assetUrl("media/screens/screenshot2.webp")} alt="n8n 微信公众号自动发布工作流运行界面" />
            </article>
          </div>
        </section>

        <section className="visual-section" id="visual">
          <div className="wrap">
            <SectionHead index="02" eyebrow="CAMERA / EDIT" title="影像制作方面的技能呈现" note="在商业短片、纪录片与风格剪辑中，承担拍摄、剪辑、制片或灯光等不同角色。" />
            <div className="film-grid">{visualFilms.map((item, index) => <VideoCard item={item} index={index} key={item.file} />)}</div>
            <div className="edit-block">
              <div className="edit-copy reveal"><span>AFTER EFFECTS / 05 CLIPS</span><h3>风格剪辑练习</h3><p>个人剪辑风格的探索，用节奏与画面表达我对影片的二次理解</p><img src={assetUrl("media/screens/screenshot1.webp")} alt="风格剪辑发布后的 B 站账号数据" /></div>
              <div className="clip-stack">{editClips.map((file) => <video className="reveal" key={file} controls preload="none" poster={assetUrl(`media/posters/${file}.webp`)}><source src={assetUrl(`source/${file}`)} type="video/mp4" /></video>)}</div>
            </div>
          </div>
        </section>

        <section className="vibe-section" id="vibe">
          <div className="wrap">
            <SectionHead index="03" eyebrow="VIBE CODING / PROTOTYPE" title="Vibe-Coding的demo/小产品" note="借助 AI 编程快速探索游戏、网页与互动产品，让概念尽早成为可运行的原型。" />
            <article className="unity-feature reveal">
              <div><span>UNITY GAME PROTOTYPE</span><h3>逃离后室</h3><p>正在学习 Unity，并通过小型原型熟悉场景、交互与游戏逻辑的组合方式。</p></div>
              <video controls preload="none" poster={assetUrl("media/posters/backroom_demo.mp4.webp")}><source src={assetUrl("source/backroom_demo.mp4")} type="video/mp4" /></video>
            </article>
            <div className="vibe-grid">
              {vibeProjects.map((project) => (
                <article className={`vibe-item vibe-item--${project.type} reveal`} key={project.title}>
                  <div className="vibe-meta"><span>{project.note}</span><h3>{project.title}</h3></div>
                  <LiveFrame title={project.title} url={project.url} variant={project.type} />
                </article>
              ))}
            </div>
            <article className="station-feature reveal">
              <div className="station-copy"><span>PRODUCT / HARDWARE</span><h3>声光驿站</h3><p>产品方案中的硬件设计实践，围绕信息输入、灯光反馈和装置交互梳理实现路径。</p></div>
              <div className="station-images"><img src={assetUrl("media/screens/screenshot3.webp")} alt="声光驿站硬件方案页面" /><img src={assetUrl("media/screens/screenshot4.webp")} alt="声光驿站硬件结构页面" /></div>
            </article>
          </div>
        </section>

        <section className="interest-section" id="interest">
          <div className="wrap">
            <SectionHead index="04" eyebrow="SIDE PROJECT / PRACTICE" title="个人兴趣" note="我热爱摄影，也对电子模块和新的软件工具保持着好奇心" />
            <article className="robot-feature reveal">
              <div className="robot-copy"><span>AI × ESP32-S3</span><h3>Mo-Chan 轮式语音机器人</h3><p>把网页控制、语音识别、LLM 对话、语音合成与电机、屏幕反馈组合成一个可操作的小型互动装置。</p><a className="text-link" href="https://github.com/2501137682/Mo-Chan_wheeled_voice_robot" target="_blank" rel="noreferrer">查看项目仓库 <ArrowUpRight size={16} /></a></div>
              <video controls preload="none" poster={assetUrl("media/posters/robot.mp4.webp")}><source src={assetUrl("source/robot.mp4")} type="video/mp4" /></video>
            </article>
            <article className="photo-hobby reveal">
              <div className="photo-hobby__head"><span>PHOTOGRAPHY / 10 SHOTS</span><h3>摄影爱好</h3></div>
              <div className="photo-hobby__lead">
                <figure className="photo-hobby__feature"><img src={assetUrl("media/photos/CYR4.webp")} alt="林间人像摄影作品" loading="lazy" decoding="async" /></figure>
                <aside className="photo-hobby__gear" aria-label="拍摄设备"><img src={assetUrl("media/photos/equipment.webp")} alt="拍摄设备" loading="lazy" decoding="async" /></aside>
              </div>
              <div className="photo-hobby__grid">
                {[1, 2, 3, 5, 6, 7, 8, 9, 10].map((n) => (
                  <figure className={`photo-hobby__shot photo-hobby__shot--${n}`} key={n}>
                    <img src={assetUrl(`media/photos/CYR${n}.webp`)} alt={`摄影作品 ${n}`} loading="lazy" decoding="async" />
                  </figure>
                ))}
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-statement"><p>从一个问题开始，<br />做成一个能被看见、理解与操作的作品。</p></div>
        <div className="footer-bottom"><span>陈奕儒 · PORTFOLIO 2026</span><a href="https://github.com/2501137682" target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a><button onClick={() => goTo("top")}>回到顶部 <ArrowUpRight size={16} /></button></div>
      </footer>
    </div>
  );
}
