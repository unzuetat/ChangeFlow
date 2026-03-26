import GovernanceTranslator from '../components/tools/GovernanceTranslator';

export default function TranslatorView() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800">Governance Translator</h2>
        <p className="text-sm text-gray-500 mt-1">
          Translate governance concepts between PRINCE2, PMI/PMBOK, and ITIL 4 —
          or describe a problem in plain language and get the official terminology.
        </p>
      </div>
      <GovernanceTranslator />
    </div>
  );
}
