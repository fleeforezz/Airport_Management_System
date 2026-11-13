import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import Table, { Column } from '../components/Table';
import Drawer from '../components/Drawer';
import { userApi } from '../../services/api';
import { formatDate } from '../../utils/format';

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Administrator Chief',
    email: 'admin@airport.gov',
    phone: '+1 (555) 019-8000',
    role: 'ADMIN',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'AeroOps Expedition Operator',
    email: 'operator@aeroops.global',
    phone: '+1 (555) 019-8800',
    role: 'TOUR_OPERATOR',
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: '3',
    name: 'Alex Morgan',
    email: 'alex@gmail.com',
    phone: '+1 (555) 019-8821',
    role: 'TRAVELER',
    createdAt: '2026-02-10T12:00:00Z',
  },
  {
    id: '4',
    name: 'Elena Vance',
    email: 'elena.vance@gmail.com',
    phone: '+1 (555) 019-9944',
    role: 'TRAVELER',
    createdAt: '2026-02-14T09:30:00Z',
  },
];

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'TOUR_OPERATOR' | 'TRAVELER'>('TRAVELER');

  useEffect(() => {
    let isMounted = true;
    userApi.getAll().then((res) => {
      if (isMounted && res.success && res.data && res.data.length > 0) {
        setUsers(res.data);
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    try {
      await userApi.updateRole(selectedUser.id, selectedRole);
    } catch {}
    setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, role: selectedRole } : u)));
    setSelectedUser(null);
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Revoke credentials and remove user account from registry?')) return;
    try {
      await userApi.delete(id);
    } catch {}
    setUsers(users.filter((u) => u.id !== id));
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'USER IDENTITY & EMAIL',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          {row.avatarUrl ? (
            <img
              src={row.avatarUrl}
              alt={row.name}
              className="w-7 h-7 object-cover border border-black flex-shrink-0"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="w-7 h-7 bg-black text-white font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0">
              {row.name.charAt(0)}
            </div>
          )}
          <div>
            <div className="font-bold text-black">{row.name}</div>
            <div className="font-mono text-[10px] text-[#4B5563]">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'PHONE CONTACT',
      render: (row) => <span className="font-mono text-xs">{row.phone || '—'}</span>,
    },
    {
      key: 'role',
      header: 'SYSTEM ROLE (RBAC)',
      render: (row) => {
        let badgeColor = 'bg-[#F5F5F5] text-black border-[#E5E7EB]';
        if (row.role === 'ADMIN') {
          badgeColor = 'bg-[#DC2626] text-white border-[#DC2626]';
        } else if (row.role === 'TOUR_OPERATOR') {
          badgeColor = 'bg-black text-white border-black';
        } else if (row.role === 'TRAVELER') {
          badgeColor = 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30';
        }
        return (
          <span className={`px-2 py-0.5 font-mono text-[10px] font-bold border ${badgeColor}`}>
            {row.role}
          </span>
        );
      },
    },
    {
      key: 'createdAt',
      header: 'ENROLLED',
      render: (row) => <span className="font-mono text-xs">{formatDate(row.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => {
              setSelectedUser(row);
              setSelectedRole(
                row.role === 'ADMIN' || row.role === 'TOUR_OPERATOR' || row.role === 'TRAVELER'
                  ? row.role
                  : 'TRAVELER'
              );
            }}
            className="px-2 py-1 bg-black text-white hover:bg-[#DC2626] font-mono text-[10px] font-bold uppercase transition-none"
          >
            EDIT ROLE
          </button>
          <button
            onClick={() => handleDeleteUser(row.id)}
            className="px-2 py-1 border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white font-mono text-[10px] font-bold uppercase transition-none"
          >
            REVOKE
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#DC2626]" />
            <h1 className="text-xl font-black uppercase text-black">
              IDENTITY & ROLE ACCESS CONTROL (RBAC)
            </h1>
          </div>
          <p className="font-mono text-xs text-[#4B5563] mt-0.5">
            MANAGE AUTHORIZED ADMINISTRATORS, TOUR OPERATORS, AND REGISTERED TRAVELERS
          </p>
        </div>
      </div>

      {/* Role explanation cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        <div className="bg-white border border-[#E5E7EB] p-3.5 space-y-1">
          <div className="flex items-center gap-2 font-bold text-black uppercase">
            <span className="w-2 h-2 bg-[#DC2626]" />
            <span>ADMINISTRATOR (ADMIN)</span>
          </div>
          <p className="text-[10px] text-[#4B5563] leading-relaxed">
            System governance: manages platform users, publishing articles/guides, airlines directory, and flight departures. Cannot create/edit tours directly.
          </p>
        </div>
        <div className="bg-white border border-[#E5E7EB] p-3.5 space-y-1">
          <div className="flex items-center gap-2 font-bold text-black uppercase">
            <span className="w-2 h-2 bg-black" />
            <span>TOUR OPERATOR (OPERATOR)</span>
          </div>
          <p className="text-[10px] text-[#4B5563] leading-relaxed">
            Aviation tour management: creates & edits tour packages, assigns baggage/cancellation policies, links supported airlines, and reviews manifests.
          </p>
        </div>
        <div className="bg-white border border-[#E5E7EB] p-3.5 space-y-1">
          <div className="flex items-center gap-2 font-bold text-black uppercase">
            <span className="w-2 h-2 bg-[#22C55E]" />
            <span>TRAVELER (PASSENGER)</span>
          </div>
          <p className="text-[10px] text-[#4B5563] leading-relaxed">
            End-user client: discovers exclusive flight tour packages, selects extra baggage packages, books seats, and exercises cancellation refund policy.
          </p>
        </div>
      </div>

      <Table columns={columns} data={users} />

      {/* Edit Role Drawer */}
      <Drawer
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={`ASSIGN ROLE: ${selectedUser?.name}`}
        subtitle="UPDATE CREDENTIAL ACCESS LEVEL"
        footer={
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedUser(null)}
              className="px-3 py-1.5 border border-[#E5E7EB] font-mono text-xs font-bold uppercase hover:bg-[#F5F5F5]"
            >
              DISCARD
            </button>
            <button
              onClick={handleUpdateRole}
              className="px-4 py-2 bg-black text-white hover:bg-[#DC2626] font-mono text-xs font-bold uppercase tracking-wider"
            >
              COMMIT ROLE
            </button>
          </div>
        }
      >
        {selectedUser && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 bg-[#F5F5F5] border border-[#E5E7EB] space-y-1">
              <div><strong>Name:</strong> {selectedUser.name}</div>
              <div><strong>Email:</strong> {selectedUser.email}</div>
              <div><strong>Current Role:</strong> {selectedUser.role}</div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#4B5563] uppercase mb-1.5">
                SELECT NEW RBAC ROLE:
              </label>
              <div className="space-y-2">
                {[
                  { role: 'TRAVELER', label: 'TRAVELER', desc: 'Can browse, book flights, choose baggage add-ons, and cancel bookings' },
                  { role: 'TOUR_OPERATOR', label: 'TOUR OPERATOR', desc: 'Can create/edit/delete tour packages, configure policies, and manage supported airlines' },
                  { role: 'ADMIN', label: 'ADMINISTRATOR', desc: 'Can manage users, publish articles, manage airlines, and supervise flight matrix' },
                ].map((item) => (
                  <label
                    key={item.role}
                    className={`p-3 border block cursor-pointer transition-none ${
                      selectedRole === item.role
                        ? 'border-2 border-black bg-[#F5F5F5]'
                        : 'border-[#E5E7EB] bg-white hover:border-black'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="userRole"
                        checked={selectedRole === item.role}
                        onChange={() => setSelectedRole(item.role as any)}
                        className="accent-black"
                      />
                      <span className="font-bold text-black uppercase">{item.label}</span>
                    </div>
                    <div className="text-[10px] text-[#4B5563] ml-5 mt-1">{item.desc}</div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default UsersPage;
