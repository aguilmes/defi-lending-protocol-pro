import TokenPing from '@/components/reads/TokenPing';
import TokenBalance from '@/components/reads/TokenBalance';
import TokenAllowance from '@/components/reads/TokenAllowance';
import HealthFactor from '@/components/reads/HealthFactor';

export default function Page() {
    return (
        <main className="p-6 space-y-3">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <TokenPing />
            <TokenBalance />
            <TokenAllowance />
            <HealthFactor />
        </main>
    );
}