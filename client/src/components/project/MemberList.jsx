import { useState } from 'react';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import { UserPlus } from 'lucide-react';

export default function MemberList({ members, isAdmin, onAddMember, onRemoveMember }) {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAddMember(email);
    setEmail('');
    setShowModal(false);
  };

  return (
    <div>
      {isAdmin && (
        <Button onClick={() => setShowModal(true)} size="sm" className="mb-4">
          <UserPlus className="w-4 h-4" />
          Add Member
        </Button>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Member">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teammate@example.com"
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Add Member</Button>
          </div>
        </form>
      </Modal>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
        {members.map((m) => (
          <div key={m.user._id} className="flex items-center justify-between p-3 sm:p-4 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Avatar name={m.user.name} size="sm" className="sm:hidden" />
              <Avatar name={m.user.name} size="md" className="hidden sm:flex" />
              <div className="min-w-0">
                <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{m.user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{m.user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Badge variant="role" value={m.role} />
              {isAdmin && m.role !== 'Admin' && (
                <button
                  onClick={() => onRemoveMember(m.user._id)}
                  className="text-xs text-rose-500 hover:text-rose-700 font-medium"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
