/* App.jsx */
import React, { useState, useEffect, useMemo } from 'react';

/* ---------- 1. Mock 数据 ---------- */
const MOCK_USERS = [
    { id: 1, username: 'admin', password: '123456', role: 'admin' },
    { id: 2, username: 'user',  password: '123456', role: 'user'  },
];

const initialUsers = [
    { id: 1, username: 'admin',      email: 'admin@site.com',      role: 'admin', status: 'active' },
    { id: 2, username: 'alice',      email: 'alice@site.com',      role: 'user',  status: 'active' },
    { id: 3, username: 'bob',        email: 'bob@site.com',        role: 'user',  status: 'inactive' },
    { id: 4, username: 'charlie',    email: 'charlie@site.com',    role: 'user',  status: 'pending' },
];

const ROUTES = { LOGIN: 'login', DASHBOARD: 'dashboard', USERS: 'users' };

/* ---------- 2. 图标 ---------- */
const Icons = {
    dashboard: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>,
    users:     <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>,
    logout:    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V5h10a1 1 0 100-2H3zm12.293 4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L16.586 13H9a1 1 0 110-2h7.586l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>,
};

/* ---------- 3. 登录页（毛玻璃居中卡片） ---------- */
function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        const u = MOCK_USERS.find(u => u.username === username && u.password === password);
        if (u) onLogin(u);
        else setError('账号或密码错误');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-sm">
                <h2 className="text-3xl font-bold text-center text-white mb-6">后台登录</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="用户名"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="密码"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    {error && <p className="text-red-300 text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition"
                    >
                        登录
                    </button>
                </form>
            </div>
        </div>
    );
}

/* ---------- 4. 用户表单 ---------- */
function UserFormModal({ user, onSave, onCancel }) {
    const [form, setForm] = useState(user || { username:'', email:'', role:'user', status:'active' });
    const [errs, setErrs] = useState({});

    const validate = () => {
        const e = {};
        if (!form.username.trim()) e.username = '必填';
        if (!form.email.trim()) e.email = '必填';
        else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) e.email = '邮箱格式错误';
        setErrs(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (validate()) onSave(form);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-4">
                <h3 className="text-xl font-bold">{user ? '编辑' : '新增'}用户</h3>
                <input
                    className={`w-full px-3 py-2 border rounded-lg ${errs.username ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="用户名"
                    value={form.username}
                    onChange={e => setForm({...form, username:e.target.value})}
                />
                {errs.username && <p className="text-red-500 text-xs">{errs.username}</p>}
                <input
                    className={`w-full px-3 py-2 border rounded-lg ${errs.email ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="邮箱"
                    value={form.email}
                    onChange={e => setForm({...form, email:e.target.value})}
                />
                {errs.email && <p className="text-red-500 text-xs">{errs.email}</p>}
                <select className="w-full border px-3 py-2 rounded-lg" value={form.role} onChange={e => setForm({...form, role:e.target.value})}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <select className="w-full border px-3 py-2 rounded-lg" value={form.status} onChange={e => setForm({...form, status:e.target.value})}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                </select>
                <div className="flex justify-end space-x-2">
                    <button onClick={onCancel} className="px-4 py-2 bg-slate-200 rounded-lg">取消</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-indigo-500 text-white rounded-lg">保存</button>
                </div>
            </div>
        </div>
    );
}

/* ---------- 5. 用户管理页 ---------- */
function UserManagementPage() {
    const [users, setUsers] = useState(initialUsers);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null);
    const PAGE_SIZE = 5;

    const filtered = useMemo(() => users.filter(u => u.username.toLowerCase().includes(search.toLowerCase())), [users, search]);
    const paged    = useMemo(() => filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE), [filtered, page]);

    const save = u => {
        u.id ? setUsers(users.map(it => it.id===u.id ? u : it))
            : setUsers([...users, {...u, id:Date.now()}]);
        setModal(null);
    };
    const del = id => {
        if (window.confirm('确定删除？')) setUsers(users.filter(u => u.id!==id));
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-slate-800">用户管理</h1>
            <div className="flex flex-col sm:flex-row justify-between mb-4 space-y-2 sm:space-y-0">
                <input
                    className="border px-3 py-2 rounded-lg w-full sm:w-1/3"
                    placeholder="搜索用户名"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
                <button onClick={() => setModal({type:'add'})} className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600">新增用户</button>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-slate-50"><tr>
                        <th className="px-3 py-3 text-left">ID</th><th className="px-3 py-3 text-left">用户名</th>
                        <th className="px-3 py-3 text-left">邮箱</th><th className="px-3 py-3 text-left">角色</th>
                        <th className="px-3 py-3 text-left">状态</th><th className="px-3 py-3 text-left">操作</th>
                    </tr></thead>
                    <tbody>
                    {paged.map(u => (
                        <tr key={u.id} className="border-b hover:bg-slate-50">
                            <td className="px-3 py-2">{u.id}</td><td className="px-3 py-2">{u.username}</td>
                            <td className="px-3 py-2">{u.email}</td><td className="px-3 py-2">{u.role}</td>
                            <td className="px-3 py-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs ${u.status==='active' ? 'bg-green-100 text-green-800' : u.status==='inactive' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{u.status}</span>
                            </td>
                            <td className="px-3 py-2 space-x-2">
                                <button onClick={() => setModal({type:'edit', user:u})} className="text-indigo-500 hover:underline">编辑</button>
                                <button onClick={() => del(u.id)} className="text-red-500 hover:underline">删除</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-slate-600">共 {filtered.length} 条</span>
                <div className="space-x-2">
                    <button disabled={page===1} onClick={() => setPage(p => p-1)} className="px-3 py-1 border rounded-lg disabled:opacity-50">上一页</button>
                    <button disabled={page>=Math.ceil(filtered.length/PAGE_SIZE)} onClick={() => setPage(p => p+1)} className="px-3 py-1 border rounded-lg disabled:opacity-50">下一页</button>
                </div>
            </div>
            {modal && <UserFormModal user={modal.user} onSave={save} onCancel={() => setModal(null)} />}
        </div>
    );
}

/* ---------- 6. 仪表盘 ---------- */
function DashboardPage({ user }) {
    return (
        <div className="w-full max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-slate-800">仪表盘</h1>
            <div className="mt-4 bg-white rounded-xl shadow p-6">
                <p className="text-lg text-slate-700">欢迎回来，<span className="font-bold text-indigo-600">{user.username}</span>！</p>
                <p className="text-slate-600 mt-1">角色：{user.role}</p>
            </div>
        </div>
    );
}

/* ---------- 7. 主 App（路由守卫） ---------- */
export default function App() {
    const [user, setUser] = useState(null);
    const [route, setRoute] = useState(ROUTES.LOGIN);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('adminUser') || 'null');
        if (saved) { setUser(saved); setRoute(ROUTES.DASHBOARD); }
    }, []);

    const login  = u => { setUser(u); localStorage.setItem('adminUser', JSON.stringify(u)); setRoute(ROUTES.DASHBOARD); };
    const logout = () => { setUser(null); localStorage.removeItem('adminUser'); setRoute(ROUTES.LOGIN); };

    const menu = [
        { key: ROUTES.DASHBOARD, label: '仪表盘', icon: Icons.dashboard, roles: ['admin', 'user'] },
        { key: ROUTES.USERS,     label: '用户管理', icon: Icons.users, roles: ['admin'] },
    ];

    if (!user) return <LoginPage onLogin={login} />;

    const allowed = menu.filter(m => m.roles.includes(user.role));
    const can = key => allowed.some(m => m.key === key);

    return (
        <div className="flex h-screen bg-slate-100">
            {/* 侧边栏 */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="h-16 flex items-center justify-center font-bold text-lg border-b border-slate-700">管理后台</div>
                <nav className="flex-1 px-2 py-4 space-y-2">
                    {allowed.map(m => (
                        <a
                            key={m.key}
                            href="#"
                            onClick={e => { e.preventDefault(); setRoute(m.key); }}
                            className={`flex items-center px-4 py-2 rounded-md transition ${route===m.key ? 'bg-indigo-600' : 'hover:bg-slate-700'}`}
                        >
                            <span className="mr-3">{m.icon}</span>{m.label}
                        </a>
                    ))}
                </nav>
                <div className="px-2 py-4 border-t border-slate-700">
                    <button onClick={logout} className="flex items-center w-full px-4 py-2 rounded-md hover:bg-slate-700">
                        <span className="mr-3">{Icons.logout}</span>退出
                    </button>
                </div>
            </aside>

            {/* 主内容：始终水平居中 */}
            <main className="flex-1 flex justify-center overflow-y-auto">
                <div className="w-full max-w-6xl">
                    {route === ROUTES.DASHBOARD && <DashboardPage user={user} />}
                    {route === ROUTES.USERS && can(ROUTES.USERS) && <UserManagementPage />}
                    {route === ROUTES.USERS && !can(ROUTES.USERS) && <div className="text-red-600 text-2xl mt-10">无权访问</div>}
                </div>
            </main>
        </div>
    );
}