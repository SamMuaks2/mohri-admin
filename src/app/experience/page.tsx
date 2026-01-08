import ProtectedRoute from "../../components/ProtectedRoute";

export default function ExperiencePage() {
  return (
    <ProtectedRoute>
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gold">Work Experience</h2>
          <button className="bg-gold text-black px-6 py-2 rounded font-semibold hover:bg-[#b8941e] transition-colors">
            + Add Experience
          </button>
        </div>

        <div className="space-y-6">
          <ExperienceCard
            position="Senior Full Stack Developer"
            company="Tech Solutions Inc."
            period="Jan 2023 - Present"
            location="Remote"
            type="Full-time"
            description="Leading development of enterprise web applications using Next.js, TypeScript, and Node.js. Managing a team of 5 developers and implementing CI/CD pipelines."
            technologies={["Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS"]}
          />
          <ExperienceCard
            position="Full Stack Developer"
            company="Digital Agency Co."
            period="Mar 2021 - Dec 2022"
            location="New York, NY"
            type="Full-time"
            description="Developed and maintained multiple client projects including e-commerce platforms and content management systems. Collaborated with design and marketing teams."
            technologies={["React", "Express", "MongoDB", "Docker"]}
          />
          <ExperienceCard
            position="Frontend Developer"
            company="Startup Ventures"
            period="Jun 2019 - Feb 2021"
            location="San Francisco, CA"
            type="Full-time"
            description="Built responsive web applications and implemented modern UI/UX designs. Worked closely with product team to deliver features quickly."
            technologies={["React", "Redux", "Material-UI", "REST APIs"]}
          />
          <ExperienceCard
            position="Junior Developer"
            company="Web Dev Studio"
            period="Jan 2018 - May 2019"
            location="Austin, TX"
            type="Full-time"
            description="Assisted in developing client websites and web applications. Learned best practices in web development and version control."
            technologies={["JavaScript", "HTML", "CSS", "jQuery", "Git"]}
          />
        </div>
      </section>
    </ProtectedRoute>
  );
}

function ExperienceCard({
  position,
  company,
  period,
  location,
  type,
  description,
  technologies,
}: {
  position: string;
  company: string;
  period: string;
  location: string;
  type: string;
  description: string;
  technologies: string[];
}) {
  return (
    <div className="bg-black border-2 border-gold p-6 rounded">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gold mb-1">{position}</h3>
          <p className="text-lg text-white font-semibold mb-2">{company}</p>
          <div className="flex gap-4 text-sm text-silver">
            <span>📅 {period}</span>
            <span>📍 {location}</span>
            <span className="bg-gold text-black px-2 py-1 rounded text-xs font-semibold">
              {type}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gold text-black rounded hover:bg-[#b8941e] transition-colors text-sm font-semibold">
            Edit
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold">
            Delete
          </button>
        </div>
      </div>
      <p className="text-silver mb-4 leading-relaxed">{description}</p>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="bg-black border border-gold text-gold px-3 py-1 rounded text-sm"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}