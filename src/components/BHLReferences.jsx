import { useMemo, useState } from 'react';
import { RESOURCES } from '../data/resources';

function youTubeThumb(url) {
  const m = url.match(/youtu\.be\/([\w-]+)/) || url.match(/[?&]v=([\w-]+)/);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
}

function resourceByIds(ids) {
  return ids.map(id => ({ id, ...RESOURCES[id] })).filter(r => r.url);
}

export default function BHLReferences({ isOpen, onClose }) {
  const [cadEmbedOpen, setCadEmbedOpen] = useState(false);
  const onshapeUrl = RESOURCES.bhl_onshape?.url;

  const sections = useMemo(() => ([
    {
      key: 'videos',
      title: '📺 BHL 공식 YouTube 튜토리얼',
      desc: '조립·플래싱·캘리브레이션 전부 영상으로 확인. ⭐는 우리 하체(다리) 조립 직접 참조.',
      items: resourceByIds([
        'bhl_video_leg',
        'bhl_video_actuator',
        'bhl_video_flashing',
        'bhl_video_calibration',
        'bhl_video_motion',
        'bhl_video_fullrobot',
        'bhl_video_arm',
        'bhl_video_demo',
        'bhl_youtube_playlist',
      ]),
      kind: 'video',
    },
    {
      key: 'cad',
      title: '📐 CAD / STL',
      desc: '팀 공유 Onshape CAD는 아래 인라인 뷰어로 바로 조작 가능. STL 출력은 BHL Releases 참조.',
      items: resourceByIds(['bhl_onshape', 'bhl_releases']),
      kind: 'cad',
    },
    {
      key: 'docs',
      title: '📖 BHL 공식 문서 (GitBook)',
      desc: '순서대로 읽으면 처음 빌드 가능. 우리 프로젝트는 하체만 BHL 사용.',
      items: resourceByIds([
        'bhl_doc_bom',
        'bhl_doc_tools',
        'bhl_doc_3dprint',
        'bhl_doc_actuator',
        'bhl_doc_flashing',
        'bhl_doc_robot',
        'bhl_doc_onboard',
        'bhl_doc_mocap',
        'bhl_docs',
        'bhl_paper',
        'bhl_site',
      ]),
      kind: 'doc',
    },
    {
      key: 'repos',
      title: '💾 GitHub / 펌웨어 / 부속 리포',
      desc: 'ESC 플래싱 펌웨어, 인코더 수정, 텔레옵 브릿지.',
      items: resourceByIds([
        'bhl_github',
        'recoil_besc',
        'as5600_mod',
        'steamvr_bridge',
      ]),
      kind: 'repo',
    },
    {
      key: 'tools',
      title: '🔧 권장 도구 / 하드웨어',
      desc: 'BHL 공식 권장 장비. 없으면 유사 성능 대체 가능.',
      items: resourceByIds([
        'bambu_x1c',
        'stm32_cubeide',
        'hipnuc_im10a',
        'bg431_esc',
      ]),
      kind: 'tool',
    },
  ]), []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative w-full max-w-[1200px] max-h-[92vh] mx-auto my-4 glass-panel overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ffffff10]">
          <div>
            <h2 className="text-lg font-bold text-[#ff00aa]">🔧 BHL 참고 자료 (하체 — Berkeley Humanoid Lite)</h2>
            <p className="text-sm text-[#9aa0b8] mt-1">
              하체는 BHL을 기준점으로 빌드합니다. 영상·공식 문서·CAD·펌웨어 순으로 따라가면 됩니다.
            </p>
          </div>
          <button onClick={onClose} className="text-sm text-[#9aa0b8] hover:text-[#e0e8ff]">✕</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8">
          {sections.map(section => (
            <section key={section.key}>
              <h3 className="text-sm font-bold text-[#00f0ff] mb-1">{section.title}</h3>
              {section.desc && (
                <p className="text-sm text-[#6a7090] mb-3">{section.desc}</p>
              )}

              {section.key === 'cad' && onshapeUrl && (
                <div className="mb-3">
                  <button
                    onClick={() => setCadEmbedOpen(v => !v)}
                    className="px-3 py-1.5 rounded-md text-sm font-medium bg-[#ff00aa15] text-[#ff00aa] border border-[#ff00aa40] hover:bg-[#ff00aa25]"
                  >
                    {cadEmbedOpen ? '▾ 인라인 CAD 뷰어 닫기' : '▸ 인라인 CAD 뷰어 열기 (Onshape)'}
                  </button>
                  {cadEmbedOpen && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-[#ff00aa30] bg-black" style={{ height: '560px' }}>
                      <iframe
                        src={onshapeUrl}
                        title="BHL Onshape CAD (팀 공유)"
                        className="w-full h-full"
                        frameBorder="0"
                        allow="fullscreen"
                      />
                    </div>
                  )}
                </div>
              )}

              {section.kind === 'video' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {section.items.map(item => {
                    const thumb = youTubeThumb(item.url);
                    return (
                      <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block rounded-lg overflow-hidden bg-[#ffffff06] hover:bg-[#ffffff0c] border border-[#ffffff10] hover:border-[#ff00aa40] transition-all"
                      >
                        {thumb ? (
                          <div className="relative aspect-video bg-black">
                            <img src={thumb} alt="" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" loading="lazy" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-[#ff00aa]/80 flex items-center justify-center text-white text-lg">▶</div>
                            </div>
                          </div>
                        ) : (
                          <div className="aspect-video bg-[#111122] flex items-center justify-center text-[#6a7090] text-sm">재생목록</div>
                        )}
                        <div className="p-3">
                          <div className="text-sm text-[#e0e8ff] font-medium leading-snug line-clamp-2">{item.label}</div>
                          <div className="text-sm text-[#4466ff] mt-1 break-all">{item.url}</div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {section.items.map(item => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 rounded-lg bg-[#ffffff06] hover:bg-[#ffffff0c] border border-[#ffffff10] hover:border-[#00f0ff40] transition-all"
                    >
                      <div className="text-sm text-[#e0e8ff] font-medium">{item.label}</div>
                      <div className="text-sm text-[#4466ff] mt-1 break-all">{item.url}</div>
                      {item.tags && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.slice(0, 4).map(tag => (
                            <span key={tag} className="text-sm text-[#6a7090] bg-[#ffffff08] px-1.5 py-0.5 rounded">{tag}</span>
                          ))}
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </section>
          ))}

          <section className="mt-6 p-4 rounded-lg bg-[#ff00aa08] border border-[#ff00aa30]">
            <h3 className="text-sm font-bold text-[#ff00aa] mb-2">🎯 하체 빌드 추천 순서 (학생용)</h3>
            <ol className="text-sm text-[#e0e8ff] space-y-1.5 list-decimal ml-5">
              <li>BOM 확인 + 도구/부품 조달 (공식 BOM ↔ 프로젝트 component 대조)</li>
              <li>3D 프린트 시작 (Bambu X1C, 액추에이터 housing/disk 프로파일 분리)</li>
              <li>AS5600 인코더 수정 + 솔더링 (링크된 notes.tk233.xyz 참조)</li>
              <li>액추에이터 조립 영상 시청 + 실제 조립 (1개 시범 후 12개 병렬)</li>
              <li>ESC 펌웨어 플래싱 (STM32CubeIDE, CAN ID 1~6·7~12 각각)</li>
              <li>단일 액추에이터 동작 테스트 → 다리 조립 영상대로 hip/knee/ankle 순 조립</li>
              <li>NUC Ubuntu 22.04 + SocketCAN + udp_joystick.py 동작 확인</li>
              <li>IM10A IMU USB 직결 + 낙상 감지 임계치 벤치 테스트</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
