import { useState } from 'react';
import { FolderOpen, ExternalLink, X } from 'lucide-react';

const projects = [
  {
    title: 'Discord Assistant Yuuki',
    description: 'An autonomous assistant bot with advanced features including reminder system, free games notification service, conversational AI chatbot, and integrated music player.',
    github: 'https://github.com/n4ctbyte/yuuki-discord-assistant',
    fileSize: '2.4 MB',
    date: '2024-11-15',
    fileType: 'py',
    hash: 'a3f5e8c9d2b1f4a6e7c8d9e0f1a2b3c4',
    images: [
      { src: 'img/help.png', label: 'CMD_INTERFACE' },
      { src: 'img/chatbot.png', label: 'AI_MODULE' },
      { src: 'img/games.png', label: 'NOTIFIER_SYS' },
      { src: 'img/weather.png', label: 'API_INTEGRATION' },
    ],
  },
];

export default function EvidenceLogs() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="evidence" className="py-20 border-t border-[#333333]">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <FolderOpen className="w-6 h-6 text-[#00FF41]" />
          <h2 className="text-3xl font-mono font-bold text-[#E0E0E0]">
            [ EVIDENCE_LOGS ]
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="border border-[#333333] hover:border-[#00FF41] transition-all group"
            >
              <div className="bg-[#0a0a0a] border-b border-[#333333] p-4 font-mono text-xs text-[#666666]">
                <div className="flex flex-wrap gap-4">
                  <span>SIZE: {project.fileSize}</span>
                  <span>DATE: {project.date}</span>
                  <span>TYPE: .{project.fileType}</span>
                  <span>MD5: {project.hash}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-mono font-bold text-[#E0E0E0] mb-3 group-hover:text-[#00FF41] transition-colors">
                  {project.title}
                </h3>

                <p className="text-[#999999] mb-4">
                  {project.description}
                </p>

                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#00FF41] hover:text-[#E0E0E0] transition-colors font-mono text-sm mb-6"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>VIEW_SOURCE.git</span>
                </a>

                <div className="grid grid-cols-4 gap-4 mt-6">
                  {project.images.map((img, imgIdx) => (
                    <div key={imgIdx} className="group/img cursor-pointer" onClick={() => setSelectedImage(img.src)}>
                      <img
                        src={img.src}
                        alt={img.label}
                        className="w-full h-auto border border-[#333333] hover:border-[#00FF41] transition-all"
                      />
                      <div className="font-mono text-xs text-[#666666] mt-1 group-hover/img:text-[#00FF41]">
                        {img.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-[#E0E0E0] hover:text-[#00FF41]"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedImage}
            alt="Evidence"
            className="max-w-full max-h-[90vh] border-2 border-[#00FF41]"
          />
        </div>
      )}
    </section>
  );
}
