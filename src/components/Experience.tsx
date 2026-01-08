import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaBriefcase, FaGraduationCap } from 'react-icons/fa';

const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const experiences = [
    {
      type: 'work',
      title: 'Data Annotation & AI Training Specialist',
      company: 'DataAnnotation',
      location: 'Ontario, Canada (Remote)',
      period: 'June 2025 - October 2025',
      description: [
        'Prepared and annotated high-quality datasets for machine learning models, ensuring accuracy and consistency',
        'Collaborated with AI development team to train and evaluate model performance',
        'Developed automation scripts in Python to optimize repetitive data processing tasks',
        'Applied Scikit-Learn and ML principles to support model validation'
      ],
      skills: ['Python', 'Machine Learning', 'Scikit-Learn', 'Data Analysis']
    },
    {
      type: 'work',
      title: 'Pharmacy Assistant Intern',
      company: 'Pharmacie du Marché de Dabou',
      location: 'Dabou, Côte d\'Ivoire',
      period: 'June 2024 - August 2024',
      description: [
        'Organized and sorted pharmaceutical products maintaining efficient inventory',
        'Provided customer service assistance under supervision',
        'Maintained cleanliness and hygiene standards complying with health regulations'
      ],
      skills: ['Customer Service', 'Organization', 'Attention to Detail']
    },
    {
      type: 'work',
      title: 'Administrative Assistant',
      company: 'Cabinet Dentaire Bel Air',
      location: 'Abidjan, Côte d\'Ivoire',
      period: 'June 2023 - August 2023',
      description: [
        'Managed and archived medical documents with attention to confidentiality',
        'Scheduled patient appointments and provided welcoming front-desk support',
        'Supported administrative tasks demonstrating professionalism and reliability'
      ],
      skills: ['Administration', 'Communication', 'Time Management']
    }
  ];

  const education = [
    {
      degree: 'Bachelor of Science (Specialized) in Computer Science',
      school: 'University of Ottawa',
      location: 'Ottawa, ON',
      period: 'September 2024 - April 2028 (Expected)',
      highlights: [
        'Co-op Program',
        'International Student Merit Scholarship - $36,000 annually',
        'Relevant courses: Data Structures, Computer Architecture, Software Engineering'
      ]
    },
    {
      degree: 'High School Diploma',
      school: 'Collège Saint-Viateur d\'Abidjan',
      location: 'Abidjan, Côte d\'Ivoire',
      period: 'September 2017 - May 2024',
      highlights: [
        'Strong foundation in mathematics and sciences',
        'Active participation in school events and community service'
      ]
    }
  ];

  return (
    <section id="experience" className="py-20" ref={ref}>
      <div className="max-w-5xl mx-auto px-4">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Experience & Education
        </motion.h2>

        {/* Work Experience */}
        <div className="mb-16">
          <motion.h3
            className="text-2xl font-bold mb-8 flex items-center gap-3 gradient-cyber"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FaBriefcase /> Work Experience
          </motion.h3>

          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                className="glass-card p-6 border-l-4 border-cyan-500"
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, borderColor: '#a855f7' }}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">{exp.title}</h4>
                    <p className="text-cyan-400 font-semibold">{exp.company}</p>
                    <p className="text-gray-400 text-sm">{exp.location}</p>
                  </div>
                  <span className="text-purple-400 text-sm font-semibold mt-2 md:mt-0">
                    {exp.period}
                  </span>
                </div>

                <ul className="space-y-2 mb-4">
                  {exp.description.map((item, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start">
                      <span className="text-cyan-400 mr-2 mt-1">▹</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-xs bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <motion.h3
            className="text-2xl font-bold mb-8 flex items-center gap-3 gradient-cyber"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <FaGraduationCap /> Education
          </motion.h3>

          <div className="space-y-6">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                className="glass-card p-6 border-l-4 border-purple-500"
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.02, borderColor: '#06b6d4' }}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">{edu.degree}</h4>
                    <p className="text-purple-400 font-semibold">{edu.school}</p>
                    <p className="text-gray-400 text-sm">{edu.location}</p>
                  </div>
                  <span className="text-cyan-400 text-sm font-semibold mt-2 md:mt-0">
                    {edu.period}
                  </span>
                </div>

                <ul className="space-y-2">
                  {edu.highlights.map((highlight, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start">
                      <span className="text-purple-400 mr-2 mt-1">▹</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;