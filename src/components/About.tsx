import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const quotes = [
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    },
    {
      text: "The beautiful thing about learning is that nobody can take it away from you.",
      author: "B.B. King"
    },
    {
      text: "The question of whether a computer can think is no more interesting than the question of whether a submarine can swim.",
      author: "Edsger Dijkstra"
    }
  ];

  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    // Select random quote on mount
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
  }, []);

  return (
    <section id="about" className="py-20" ref={ref}>
      <div className="max-w-4xl mx-auto px-4">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-12 gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          About Me
        </motion.h2>

        <motion.div
          className="glass-card p-8 md:p-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Philosophical Quote */}
          <motion.div
            className="mb-8 p-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/20"
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-lg italic text-gray-300 mb-2">
              "{currentQuote.text}"
            </p>
            <p className="text-right text-sm gradient-cyber font-semibold">
              — {currentQuote.author}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              I'm a second-year <span className="gradient-cyber font-semibold">Computer Science student</span> at 
              the University of Ottawa, passionate about leveraging technology to solve real-world problems. 
              My journey in tech is driven by curiosity and a deep fascination with how artificial intelligence 
              can transform industries.
            </p>

            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              With hands-on experience in <span className="gradient-cyber font-semibold">AI/ML development</span>, 
              data annotation, and full-stack development, I've worked on projects ranging from guitar transcription 
              systems to restaurant management applications. I thrive on challenges that push me to learn new 
              technologies and think creatively.
            </p>

            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Beyond coding, I'm deeply interested in <span className="gradient-cyber font-semibold">cybersecurity</span> and 
              ethical hacking, constantly exploring ways to build more secure and resilient systems. I believe in 
              the power of open-source development and contributing to the tech community.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                className="text-center p-4 bg-white/5 rounded-lg"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-3xl font-bold gradient-cyber mb-2">5+</div>
                <div className="text-gray-400">Months Experience</div>
              </motion.div>

              <motion.div
                className="text-center p-4 bg-white/5 rounded-lg"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-3xl font-bold gradient-cyber mb-2">10+</div>
                <div className="text-gray-400">Projects Completed</div>
              </motion.div>

              <motion.div
                className="text-center p-4 bg-white/5 rounded-lg"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-3xl font-bold gradient-cyber mb-2">3</div>
                <div className="text-gray-400">Languages</div>
              </motion.div>
            </div>

            <motion.div
              className="mt-8 flex flex-wrap gap-3 justify-center"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {['English', 'French', 'Arabic'].map((lang, index) => (
                <motion.span
                  key={lang}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full text-sm border border-cyan-500/30"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {lang}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;