import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { Search, Star, Clock, Users, ArrowRight, BookOpen, Sparkles, RefreshCw } from 'lucide-react';

interface CoursesSectionProps {
  onSelectCourse: (course: any) => void;
  onEnrollCourse: (course: any) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  onSelectCourse,
  onEnrollCourse,
}) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesData, categoriesData] = await Promise.all([
        api.public.getCourses(),
        api.public.getCategories(),
      ]);
      setCourses(coursesData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error fetching courses from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categoryOptions = useMemo(() => {
    return ['All', ...categories.map((c) => c.name)];
  }, [categories]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        course.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.overview?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(course.skillsAcquired) &&
          course.skillsAcquired.some((skill: string) =>
            skill.toLowerCase().includes(searchQuery.toLowerCase())
          )) ||
        (Array.isArray(course.technologies) &&
          course.technologies.some((tech: string) =>
            tech.toLowerCase().includes(searchQuery.toLowerCase())
          ));
      return matchesCategory && matchesSearch;
    });
  }, [courses, selectedCategory, searchQuery]);

  return (
    <section id="courses" className="py-20 bg-[#050A1A] relative">
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-[#00D2FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FF7A00]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#00D2FF] tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DYNAMIC DATABASE CURRICULA</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Industry-Grade Engineering Courses
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Real-world bootcamps powered directly by our live database. Master high-demand tech stacks through deep lab architecture.
            </p>
          </div>

          {/* Real-time search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skills, tech, stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2FF] transition-colors"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#00D2FF] to-[#0088FF] text-slate-950 font-bold shadow-md shadow-[#00D2FF]/20'
                  : 'bg-white/[0.03] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-[#00D2FF]" />
            <span>Loading courses from database...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="group rounded-3xl bg-[#091129] border border-white/10 hover:border-[#00D2FF]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:shadow-[#00D2FF]/10 hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[#00D2FF] font-semibold">{course.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{course.level}</span>
                    </div>
                    {course.featured && (
                      <span className="text-[11px] font-bold text-[#FF7A00] tracking-wide">
                        Featured
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => onSelectCourse(course)}
                    className="text-lg font-bold text-white group-hover:text-[#00D2FF] transition-colors cursor-pointer line-clamp-2 mb-3 leading-snug"
                  >
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
                    {course.overview}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {Array.isArray(course.technologies) &&
                      course.technologies.slice(0, 4).map((tech: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/5 text-[11px] text-slate-300 font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="w-8 h-8 rounded-full bg-blue-900/60 border border-[#00D2FF]/30 flex items-center justify-center text-xs font-bold text-[#00D2FF]">
                      {course.trainerName?.charAt(0) || 'H'}
                    </div>
                    <div className="text-xs">
                      <div className="font-semibold text-slate-200">{course.trainerName}</div>
                      <div className="text-slate-400 text-[11px]">{course.duration} Program</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="flex items-center justify-between text-xs text-slate-400 py-3 border-t border-white/5 mb-4">
                    <div className="flex items-center gap-1 text-[#FF7A00] font-semibold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{course.rating || 5.0}</span>
                      <span className="text-slate-500">({course.reviewsCount || 0})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#00D2FF]" />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xl font-black text-white">${course.price}</span>
                      {course.originalPrice && (
                        <span className="text-xs text-slate-500 line-through ml-1.5">
                          ${course.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectCourse(course)}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onEnrollCourse(course)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#00D2FF] to-[#38BDF8] hover:brightness-110 shadow-md shadow-[#00D2FF]/20 transition-all flex items-center gap-1"
                      >
                        <span>Enroll</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
