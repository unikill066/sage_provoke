import React from 'react';

export default function DesignOptionsModal({ modalOpen, setModalOpen, modalOptions, modalPrompt, expandedCard, expandedDescriptions, toggleCardExpansion, toggleDescriptionExpansion, handleModalSelect, getConfidenceColor, truncateText, motion, Separator, Card, CardContent, Badge, Button }) {
  if (!modalOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{modalPrompt}</h2>
          <p className="text-gray-600 mt-2">Select the design approach that best fits your vision</p>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {modalOptions.map((option, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-200">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleCardExpansion(index)}
                    className={`w-full p-6 ${option.previewClass} border-b border-gray-100 text-left hover:bg-opacity-80 transition-all duration-200`}
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{option.text}</h3>
                      <div className="flex items-center gap-3">
                        <Badge className={getConfidenceColor(option.confidence)}>
                          {option.confidence}% confidence
                        </Badge>
                        <svg 
                          className={`w-5 h-5 text-gray-500 transition-transform ${expandedCard === index ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                  
                  {expandedCard === index && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 bg-gray-50">
                        <h4 className="font-semibold text-gray-900 mb-3">Why {option.confidence}% Confidence?</h4>
                        <p className="text-sm text-gray-700 leading-relaxed mb-4">
                          {option.description}
                        </p>
                        
                        <div className="mt-4 mb-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Design Preview</h4>
                          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                            {index === 0 && (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="h-4 bg-slate-200 rounded w-24"></div>
                                  <div className="h-4 bg-slate-200 rounded w-16"></div>
                                </div>
                                <div className="flex space-x-4">
                                  <div className="h-3 bg-slate-200 rounded w-12"></div>
                                  <div className="h-3 bg-slate-200 rounded w-16"></div>
                                  <div className="h-3 bg-slate-200 rounded w-14"></div>
                                </div>
                                <div className="space-y-2">
                                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                                  <div className="h-4 bg-slate-200 rounded w-4/5"></div>
                                </div>
                                <div className="h-8 bg-slate-300 rounded w-20"></div>
                              </div>
                            )}
                            {index === 1 && (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="h-5 bg-purple-200 rounded w-28"></div>
                                  <div className="h-5 bg-purple-200 rounded w-20"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-purple-100 rounded-lg p-3 border border-purple-200">
                                    <div className="h-4 bg-purple-200 rounded w-16 mb-2"></div>
                                    <div className="h-3 bg-purple-200 rounded w-full mb-1"></div>
                                    <div className="h-3 bg-purple-200 rounded w-3/4"></div>
                                  </div>
                                  <div className="bg-purple-100 rounded-lg p-3 border border-purple-200">
                                    <div className="h-4 bg-purple-200 rounded w-14 mb-2"></div>
                                    <div className="h-3 bg-purple-200 rounded w-full mb-1"></div>
                                    <div className="h-3 bg-purple-200 rounded w-2/3"></div>
                                  </div>
                                </div>
                                <div className="h-10 bg-purple-300 rounded-lg w-24"></div>
                              </div>
                            )}
                            {index === 2 && (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="h-6 bg-blue-200 rounded w-32"></div>
                                  <div className="h-6 bg-blue-200 rounded w-24"></div>
                                </div>
                                <div className="flex space-x-4">
                                  <div className="h-8 bg-blue-200 rounded-lg w-20"></div>
                                  <div className="h-8 bg-blue-200 rounded-lg w-24"></div>
                                  <div className="h-8 bg-blue-200 rounded-lg w-20"></div>
                                </div>
                                <div className="space-y-3">
                                  <div className="h-7 bg-blue-200 rounded w-full"></div>
                                  <div className="h-5 bg-blue-200 rounded w-full"></div>
                                  <div className="h-5 bg-blue-200 rounded w-5/6"></div>
                                  <div className="h-5 bg-blue-200 rounded w-4/5"></div>
                                </div>
                                <div className="h-12 bg-blue-300 rounded-lg w-32"></div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <Button 
                            onClick={() => handleModalSelect(option, index)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Select This Design
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setModalOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 