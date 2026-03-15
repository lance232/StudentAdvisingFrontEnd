import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Users, UserCog, Check, X, Edit2, Save } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface Advisor {
  id: number;
  name: string;
  email: string;
  advisorId: string;
  assignedYearLevel: string | null;
  status: 'active' | 'inactive';
}

const initialAdvisors: Advisor[] = [
  { id: 1, name: 'Dr. Maria Santos', email: 'm.santos@usjr.edu.ph', advisorId: '1000000001', assignedYearLevel: 'BSCPE-3', status: 'active' },
  { id: 2, name: 'Prof. Juan Reyes', email: 'j.reyes@usjr.edu.ph', advisorId: '1000000002', assignedYearLevel: 'BSCPE-1', status: 'active' },
  { id: 3, name: 'Dr. Ana Garcia', email: 'a.garcia@usjr.edu.ph', advisorId: '1000000003', assignedYearLevel: 'BSCPE-4', status: 'active' },
  { id: 4, name: 'Prof. Miguel Cruz', email: 'm.cruz@usjr.edu.ph', advisorId: '1000000004', assignedYearLevel: 'BSCPE-2', status: 'active' },
  { id: 5, name: 'Dr. Carlos Lopez', email: 'c.lopez@usjr.edu.ph', advisorId: '1000000005', assignedYearLevel: null, status: 'inactive' },
];

export function ChairmanDashboard() {
  const [advisors, setAdvisors] = useState<Advisor[]>(initialAdvisors);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAssignYearLevel = (advisorId: number, yearLevel: string | null) => {
    setAdvisors(advisors.map(advisor => 
      advisor.id === advisorId 
        ? { ...advisor, assignedYearLevel: yearLevel, status: yearLevel ? 'active' : 'inactive' }
        : advisor
    ));
    setEditingId(null);
  };

  const filteredAdvisors = advisors.filter(advisor => 
    advisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    advisor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    advisor.advisorId.includes(searchTerm)
  );

  const yearLevelCounts = {
    'BSCPE-1': advisors.filter(a => a.assignedYearLevel === 'BSCPE-1').length,
    'BSCPE-2': advisors.filter(a => a.assignedYearLevel === 'BSCPE-2').length,
    'BSCPE-3': advisors.filter(a => a.assignedYearLevel === 'BSCPE-3').length,
    'BSCPE-4': advisors.filter(a => a.assignedYearLevel === 'BSCPE-4').length,
    'Unassigned': advisors.filter(a => !a.assignedYearLevel).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="tracking-tight">Advisor Management</h2>
        <p className="text-gray-600">Assign advisors to year levels for Computer Engineering students</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="border-green-200 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">BSCPE-1</p>
                <p className="text-2xl font-bold text-green-900">{yearLevelCounts['BSCPE-1']}</p>
                <p className="text-xs text-gray-500 mt-1">Advisor{yearLevelCounts['BSCPE-1'] !== 1 ? 's' : ''} Assigned</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">BSCPE-2</p>
                <p className="text-2xl font-bold text-green-900">{yearLevelCounts['BSCPE-2']}</p>
                <p className="text-xs text-gray-500 mt-1">Advisor{yearLevelCounts['BSCPE-2'] !== 1 ? 's' : ''} Assigned</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">BSCPE-3</p>
                <p className="text-2xl font-bold text-green-900">{yearLevelCounts['BSCPE-3']}</p>
                <p className="text-xs text-gray-500 mt-1">Advisor{yearLevelCounts['BSCPE-3'] !== 1 ? 's' : ''} Assigned</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">BSCPE-4</p>
                <p className="text-2xl font-bold text-green-900">{yearLevelCounts['BSCPE-4']}</p>
                <p className="text-xs text-gray-500 mt-1">Advisor{yearLevelCounts['BSCPE-4'] !== 1 ? 's' : ''} Assigned</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Unassigned</p>
                <p className="text-2xl font-bold text-yellow-700">{yearLevelCounts['Unassigned']}</p>
                <p className="text-xs text-gray-500 mt-1">Awaiting Assignment</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <UserCog className="h-6 w-6 text-yellow-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advisors List */}
      <Card className="border-green-200 shadow-md">
        <CardHeader className="bg-gradient-to-r from-green-50 to-yellow-50 border-b border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-green-900">Faculty Advisors</CardTitle>
              <CardDescription>Manage year level assignments for Computer Engineering advisors</CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-300">
              {advisors.filter(a => a.status === 'active').length} Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Search */}
          <div className="mb-6">
            <Label htmlFor="search">Search Advisors</Label>
            <Input
              id="search"
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Advisors Table */}
          <div className="space-y-3">
            {filteredAdvisors.map((advisor) => (
              <div 
                key={advisor.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-600 to-yellow-500 flex items-center justify-center shadow">
                      <span className="text-sm font-bold text-white">
                        {advisor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{advisor.name}</h4>
                      <p className="text-sm text-gray-600">{advisor.email}</p>
                      <p className="text-xs text-gray-500">ID: {advisor.advisorId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {editingId === advisor.id ? (
                      <>
                        <Select 
                          defaultValue={advisor.assignedYearLevel || undefined}
                          onValueChange={(value) => handleAssignYearLevel(advisor.id, value === 'none' ? null : value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select year level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Unassign</SelectItem>
                            <SelectItem value="BSCPE-1">BSCPE-1</SelectItem>
                            <SelectItem value="BSCPE-2">BSCPE-2</SelectItem>
                            <SelectItem value="BSCPE-3">BSCPE-3</SelectItem>
                            <SelectItem value="BSCPE-4">BSCPE-4</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        {advisor.assignedYearLevel ? (
                          <Badge className="bg-green-100 text-green-800 border-green-300 px-3 py-1">
                            {advisor.assignedYearLevel}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-600 px-3 py-1">
                            Unassigned
                          </Badge>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(advisor.id)}
                          className="border-green-300 text-green-700 hover:bg-green-50"
                        >
                          <Edit2 className="h-4 w-4 mr-1" />
                          {advisor.assignedYearLevel ? 'Reassign' : 'Assign'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAdvisors.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No advisors found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Year Level Overview */}
      <Card className="border-green-200 shadow-md">
        <CardHeader className="bg-gradient-to-r from-green-50 to-yellow-50 border-b border-green-200">
          <CardTitle className="text-green-900">Year Level Overview</CardTitle>
          <CardDescription>Distribution of advisors across year levels</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['BSCPE-1', 'BSCPE-2', 'BSCPE-3', 'BSCPE-4'].map((yearLevel) => {
              const assignedAdvisors = advisors.filter(a => a.assignedYearLevel === yearLevel);
              return (
                <div key={yearLevel} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{yearLevel}</h4>
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      {assignedAdvisors.length} Advisor{assignedAdvisors.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  {assignedAdvisors.length > 0 ? (
                    <div className="space-y-2">
                      {assignedAdvisors.map((advisor) => (
                        <div key={advisor.id} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-gray-700">{advisor.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No advisor assigned yet</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
