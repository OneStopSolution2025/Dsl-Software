import { Clock, ShieldCheck, Headphones } from 'lucide-react';

export const AuthSidebar = () => {
  const features = [
    {
      icon: <Clock className="h-5 w-5" />,
      title: 'Own Your Hours, Work in Minutes',
      description: 'Process claims in minutes, not hours',
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: 'Data Encryption, Safe Like Money in the Bank',
      description: 'Bank-level encryption for your data',
    },
    {
      icon: <Headphones className="h-5 w-5" />,
      title: 'Convenience of 24/7 Support',
      description: 'Expert assistance whenever you need',
    },
  ];

  return (
    <div className="hidden lg:flex lg:w-2/5 bg-white p-12 flex-col justify-between relative border-r border-gray-200">
      {/* Decorative accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-emerald-500"></div>

      <div className="relative z-10">
        {/* Logo and Brand */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <img 
              src="/images/brand-green.png" 
              alt="Rapid Reportz" 
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
            Transforming work from manual to intelligent
          </h1>
          <p className="text-gray-600 text-lg">
            Fast, secure, and reliable claims processing at your fingertips
          </p>
        </div>

        {/* Feature List */}
        <div className="space-y-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex items-start gap-4 group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 group-hover:bg-teal-100 transition-colors">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-gray-900 font-semibold text-lg mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section - Illustration & Social Proof */}
      <div className="relative z-10">
        {/* Decorative illustration */}
        <div className="mb-6 flex items-center justify-center">
          <div className="relative">
            {/* Abstract illustration using SVG */}
            <svg 
              width="200" 
              height="150" 
              viewBox="0 0 200 150" 
              fill="none" 
              className="opacity-90"
            >
              {/* Document icon */}
              <rect x="40" y="20" width="80" height="100" rx="4" fill="#f0fdfa" stroke="#14b8a6" strokeWidth="2" />
              <rect x="50" y="35" width="60" height="4" rx="2" fill="#14b8a6" />
              <rect x="50" y="45" width="50" height="4" rx="2" fill="#5eead4" />
              <rect x="50" y="55" width="55" height="4" rx="2" fill="#5eead4" />
              
              {/* Checkmark circle */}
              <circle cx="150" cy="80" r="30" fill="#10b981" />
              <path 
                d="M140 80 L148 88 L162 72" 
                stroke="white" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                fill="none"
              />
              
              {/* Lightning bolt accent */}
              <path 
                d="M35 65 L30 80 L38 80 L33 95" 
                fill="#f59e0b" 
              />
            </svg>
          </div>
        </div>

        {/* Trust Badges */}
        {/* <div className="space-y-3">
          <div className="flex items-center gap-4 bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Bank-Grade Security</p>
              <p className="text-xs text-gray-500">256-bit SSL Encryption</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">ISO 27001 Certified</p>
              <p className="text-xs text-gray-500">Industry Standard Compliance</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">GDPR Compliant</p>
              <p className="text-xs text-gray-500">Your Data, Your Control</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};
