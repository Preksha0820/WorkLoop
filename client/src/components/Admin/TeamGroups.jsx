import React, { useEffect, useState } from 'react';
import apiService from '../../api/apiService';
import {
  Search,
  ChevronUp,
  ChevronDown,
  Users,
  UserCheck,
  Crown,
  Mail,
  Filter,
  Grid3X3,
  List,
  Sparkles,
  Building2
} from 'lucide-react';

const TeamGroup = () => {
  const [teams, setTeams] = useState([]);
  const [expandedTeams, setExpandedTeams] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'compact'

  useEffect(() => {
    fetchTeamGroups();
  }, []);

  const fetchTeamGroups = async () => {
    setLoading(true);
    try {
      const res = await apiService.get('/admin/team-groups');
      setTeams(res.data.data || []);
      // Expand all by default
      const expanded = {};
      res.data.data.forEach((_, index) => {
        expanded[index] = true;
      });
      setExpandedTeams(expanded);
    } catch (err) {
      console.error('Failed to fetch team groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index) => {
    setExpandedTeams((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleAllExpanded = () => {
    const allExpanded = Object.values(expandedTeams).every(Boolean);
    const newState = {};
    teams.forEach((_, index) => {
      newState[index] = !allExpanded;
    });
    setExpandedTeams(newState);
  };

  const filteredTeams = teams.filter((group) => {
    const lead = group.teamLead;
    const employees = group.employees || [];
    return (
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employees.some(
        (emp) =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  const totalEmployees = teams.reduce((sum, team) => sum + team.employees.length, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading team groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Team Groups
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage {teams.length} teams with {totalEmployees} total employees
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={toggleAllExpanded}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-400 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Filter className="w-4 h-4" />
                {Object.values(expandedTeams).every(Boolean) ? 'Collapse All' : 'Expand All'}
              </button>
              
              <div className="flex bg-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('card')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'card' 
                      ? 'bg-white shadow-sm text-indigo-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'compact' 
                      ? 'bg-white shadow-sm text-indigo-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search teams, leads, or employees..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-500 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Team List */}
        {filteredTeams.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No teams found</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {searchTerm ? 'Try adjusting your search terms' : 'No team groups have been created yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTeams.map((group, index) => (
              <div
                key={group.teamLead.id}
                className="bg-white rounded-2xl border border-gray-500 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Team Lead Header */}
                <div
                  className="relative cursor-pointer group "
                  onClick={() => toggleExpand(index)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to bg-purple-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                            {group.teamLead.name.charAt(0)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-bold mb-1">{group.teamLead.name}</h2>
                          <div className="flex items-center gap-2 text-white/90 mb-2">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm">{group.teamLead.email}</span>
                          </div>
                          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                            <Sparkles className="w-3 h-3" />
                            Team Lead
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold">{group.employees.length}</div>
                          <div className="text-sm text-white/80">Members</div>
                        </div>
                        <div className="p-2 bg-white/20 rounded-lg">
                          {expandedTeams[index] ? (
                            <ChevronUp className="w-6 h-6 transition-transform duration-200" />
                          ) : (
                            <ChevronDown className="w-6 h-6 transition-transform duration-200" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                <div className={`transition-all duration-300 ease-in-out ${
                  expandedTeams[index] 
                    ? 'max-h-screen opacity-100' 
                    : 'max-h-0 opacity-0 overflow-hidden'
                }`}>
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                    {group.employees.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                          <Users className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No team members yet</p>
                        <p className="text-gray-400 text-sm mt-1">This team is waiting for members to be assigned</p>
                      </div>
                    ) : (
                      <div className={`grid gap-4 ${
                        viewMode === 'card' 
                          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                          : 'grid-cols-1'
                      }`}>
                        {group.employees.map((emp, empIndex) => (
                          <div
                            key={emp.id}
                            className={`group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition-all duration-200 ${
                              viewMode === 'compact' ? 'flex items-center justify-between' : ''
                            }`}
                            style={{
                              animationDelay: `${empIndex * 50}ms`,
                              animation: expandedTeams[index] ? 'fadeInUp 0.3s ease-out forwards' : ''
                            }}
                          >
                            <div className={`flex items-center gap-3 ${viewMode === 'compact' ? 'flex-1' : ''}`}>
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                {emp.name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{emp.name}</p>
                                <p className="text-sm text-gray-500 truncate">{emp.email}</p>
                                {emp.role && (
                                  <p className="text-xs text-indigo-600 font-medium mt-1">{emp.role}</p>
                                )}
                              </div>
                            </div>
                            
                            <div className={`${viewMode === 'compact' ? 'ml-4' : 'mt-3 flex justify-between items-center'}`}>
                              <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200">
                                <UserCheck className="w-3 h-3" />
                                Employee
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TeamGroup;