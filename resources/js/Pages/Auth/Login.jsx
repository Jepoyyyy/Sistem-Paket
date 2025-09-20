import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import { Head } from '@inertiajs/react';


export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <div className="bg-gray-300 min-h-screen flex items-center justify-center select-none">
            <Head title="Log in" />
            <div className="w-full max-w-3xl flex flex-col md:flex-row bg-white shadow-lg rounded-2xl p-5 mx-4 md:mx-auto my-8">

                {/* Logo */}
                <div className="w-full md:w-1/2 p-5 flex justify-center items-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/11/BPKP_Logo.png" alt="Logo BPKP" className="w-40 md:w-52" />
                </div>

                {/* Form */}
                <form onSubmit={submit} className="w-full md:w-1/2 p-5">

                    {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-bold text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                        />
                        {errors.email && <InputError message={errors.email} className="mt-2" />}
                    </div>

                    {/* Password */}
                    <div className="mt-4">
                        <label htmlFor="password" className="block text-sm font-bold text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                        />
                        {errors.password && <InputError message={errors.password} className="mt-2" />}
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center mt-4">
                        <input
                            id="remember_me"
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="p-2 hover:border-indigo-500 text-indigo-600 border-gray-500 rounded"
                        />
                        <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">Ingat Saya</label>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-end mt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Log in
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="mt-5 flex justify-center">
                        <p className="text-xs text-gray-500">© 2025 Badan Pengawasan Keuangan Pembangunan</p>
                    </div>

                </form>
            </div>
        </div>
    );
}
