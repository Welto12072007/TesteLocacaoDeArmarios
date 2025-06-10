import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Mail, Phone, GraduationCap } from 'lucide-react';
import Layout from '../common/Layout';
import Button from '../common/Button';
import Table from '../common/Table';
import { Student } from '../../types';
import { apiService } from '../../services/api';

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadStudents();
  }, [currentPage]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getStudents(currentPage, 10);
      setStudents(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Student['status']) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Ativo' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inativo' },
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const columns = [
    {
      key: 'name',
      label: 'Nome',
      sortable: true,
      render: (value: string, row: Student) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {value.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.studentId}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (value: string) => (
        <div className="flex items-center">
          <Mail className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Telefone',
      render: (value: string) => (
        <div className="flex items-center">
          <Phone className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: 'course',
      label: 'Curso',
      render: (value: string, row: Student) => (
        <div className="flex items-center">
          <GraduationCap className="h-4 w-4 text-gray-400 mr-2" />
          <div>
            <div className="text-sm text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">{row.semester}º Semestre</div>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: Student['status']) => getStatusBadge(value),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (value: any, row: Student) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={() => handleEdit(row.id)}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            className="text-red-600 hover:text-red-700"
            onClick={() => handleDelete(row.id)}
          />
        </div>
      ),
    },
  ];

  const handleAdd = () => {
    console.log('Add new student');
    // In a real app, open modal or navigate to form
  };

  const handleEdit = (id: string) => {
    console.log('Edit student:', id);
    // In a real app, open modal or navigate to form
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        await apiService.deleteStudent(id);
        loadStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  return (
    <Layout currentPage="students">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Alunos</h1>
            <p className="text-gray-600">Gerencie todos os alunos cadastrados no sistema</p>
          </div>
          <Button icon={Plus} onClick={handleAdd}>
            Novo Aluno
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Alunos Ativos</dt>
                    <dd className="text-lg font-medium text-gray-900">285</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Alunos Inativos</dt>
                    <dd className="text-lg font-medium text-gray-900">35</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Com Locações</dt>
                    <dd className="text-lg font-medium text-gray-900">98</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
                    <dd className="text-lg font-medium text-gray-900">320</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <Table
          columns={columns}
          data={students}
          loading={loading}
          pagination={{
            currentPage,
            totalPages,
            total,
            onPageChange: setCurrentPage,
          }}
        />
      </div>
    </Layout>
  );
};

export default StudentManagement;