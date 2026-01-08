import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  FaPython, 
  FaJava, 
  FaReact, 
  FaHtml5, 
  FaCss3Alt, 
  FaGitAlt, 
  FaDatabase,
  FaBrain,
  FaShieldAlt
} from 'react-icons/fa';
import { 
  SiTypescript, 
  SiJavascript, 
  SiTailwindcss,
  SiScikitlearn,
  SiPytorch,
  SiMysql,
  SiFastapi
} from 'react-icons/si';

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const skillCategories = [
    {
      title: 'Programming Languages',
      icon: <FaPython className="text-4xl" />,
      gradient: 'from-blue-500 to-cyan-500',
      skills: [
        { name: 'Python', icon: <FaPython />, color: 'text-blue-400' },
        { name: 'Java', icon: <FaJava />, color: 'text-red-400' },
        { name: 'JavaScript', icon: <SiJavascript />, color: 'text-yellow-400' },
        { name: 'TypeScript', icon: <SiTypescript />, color: 'text-blue-500' },
        { name: 'Assembly', icon: <FaDatabase />, color: 'text-gray-400' },
      ]
    },
    {
      title: 'Web Technologies',
      icon: <FaReact className="text-4xl" />,
      gradient: 'from-purple-500 to-pink-500',
      skills: [
        { name: 'React', icon: <FaReact />, color: 'text-cyan-400' },
        { name: 'HTML5', icon: <FaHtml5 />, color: 'text-orange-500' },
        { name: 'CSS3', icon: <FaCss3Alt />, color: 'text-blue-500' },
        { name: 'TailwindCSS', icon: <SiTailwindcss />, color: 'text-cyan-400' },
        { name: 'FastAPI', icon: <SiFastapi />, color: 'text-green-500' },
      ]
    },
    {
      title: 'AI/ML & Data',
      icon: <FaBrain className="text-4xl" />,
      gradient: 'from-green-500 to-teal-500',
      skills: [
        { name: 'Scikit-Learn', icon: <SiScikitlearn />, color: 'text-orange-400' },
        { name: 'PyTorch', icon: <SiPytorch />, color: 'text-red-500' },
        { name: 'Librosa', icon: <FaPython />, color: 'text-blue-400' },
        { name: 'NumPy', icon: <FaPython />, color: 'text-blue-300' },
        { name: 'Basic-Pitch', icon: <FaBrain />, color: 'text-purple-400' },
      ]
    },
    {
      title: 'Tools & Databases',
      icon: <FaDatabase className="text-4xl" />,
      gradient: 'from-yellow-500 to-orange-500',
      skills: [
        { name: 'MySQL', icon: <SiMysql />, color: 'text-blue-600' },
        { name: 'Git', icon: <FaGitAlt />, color: 'text-orange-600' },
        { name: 'OOP', icon: <FaJava />, color: 'text-red-400' },
        { name: 'Virtual Env', icon: <FaPython />, color: 'text-green-400' },
      ]
    },
    {
      title: 'Interests & Focus',
      icon: <FaShieldAlt className="text-4xl" />,
      gradient: 'from-red-500 to-purple-500',
      skills: [
        { name: 'Artificial Intelligence', icon: <FaBrain />, color: 'text-purple-400' },
        { name: 'Cybersecurity', icon: <FaShieldAlt />, color: 'text-red-400' },
        { name: 'Machine Learning', icon: <SiPytorch />, color: 'text-orange-400' },
        { name: 'Problem Solving', icon: <FaBrain />, color: 'text-cyan-400' },
      ]
    }
  ];

  return (
    <section id="skills" className="py-20" ref={ref}>
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Technical Skills
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              className="glass-card p-6"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`bg-gradient-to-r ${category.gradient} p-3 rounded-lg`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{category.title}</h3>
              </div>

              <div className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3, delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                    whileHover={{ x: 5 }}
                  >
                    <span className={`text-xl ${skill.color}`}>{skill.icon}</span>
                    <span className="text-gray-300">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Soft Skills */}
        <motion.div
          className="mt-12 glass-card p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-center mb-6 gradient-cyber">Soft Skills</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'Problem Solving',
              'Teamwork',
              'Communication',
              'Critical Thinking',
              'Adaptability',
              'Time Management',
              'Leadership',
              'Creativity'
            ].map((skill, index) => (
              <motion.span
                key={skill}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-500/30 text-gray-300"
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                whileHover={{ scale: 1.1, borderColor: 'rgba(0, 212, 255, 0.5)' }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;