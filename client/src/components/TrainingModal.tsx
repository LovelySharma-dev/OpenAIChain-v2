import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { TrainingResponse } from "../api";

interface TrainingModalProps {
  result: TrainingResponse | null;
  onClose: () => void;
}

export function TrainingModal({ result, onClose }: TrainingModalProps) {
  if (!result) return null;

  const { modelName, data } = result;
  const { federatedAccuracy, federatedLoss, accuracy, loss, nodes } = data || {};

  // Format number to 2 decimal places
  const formatNumber = (value: number | undefined): string => {
    if (value === undefined || value === null || isNaN(value)) return "—";
    return value.toFixed(2);
  };

  // Format timestamp
  const formatTimestamp = (timestamp?: string): string => {
    if (!timestamp) return "N/A";
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
    }
  };

  // Determine if we have federated data or regular training data
  const hasFederatedData = federatedAccuracy !== undefined || federatedLoss !== undefined;
  const hasNodes = nodes && nodes.length > 0;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-purple-950 via-blue-950 to-purple-950 border-2 border-purple-500/80 rounded-2xl p-8 w-[90%] max-w-2xl text-gray-100 shadow-2xl relative backdrop-blur-none"
          style={{ backgroundColor: 'rgba(30, 10, 50, 0.98)' }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-purple-300 transition-colors z-10"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold mb-2 text-purple-100">
              Training Complete: {modelName}
            </h2>
            <p className="text-gray-300 mb-6">
              {hasFederatedData ? "Federated Learning Summary across all nodes" : "Training Summary"}
            </p>
          </motion.div>

          {/* Metrics Summary */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-between items-center mb-6 p-4 bg-purple-900/30 rounded-lg border border-purple-500/30"
          >
            <div className="flex-1">
              <p className="text-sm text-gray-300 mb-1">
                🌐 <strong className="text-purple-300">Federated Accuracy:</strong>
              </p>
              <p className="text-lg font-semibold text-green-400">
                {federatedAccuracy !== undefined 
                  ? `${formatNumber(federatedAccuracy)}%` 
                  : accuracy !== undefined
                  ? `${formatNumber(accuracy)}%`
                  : "⏳ Waiting for training data..."}
              </p>
            </div>
            <div className="flex-1 text-right">
              <p className="text-sm text-gray-300 mb-1">
                📉 <strong className="text-purple-300">Federated Loss:</strong>
              </p>
              <p className="text-lg font-semibold text-red-400">
                {federatedLoss !== undefined 
                  ? formatNumber(federatedLoss)
                  : loss !== undefined
                  ? formatNumber(loss)
                  : "⏳ Waiting for training data..."}
              </p>
            </div>
          </motion.div>

          {/* Nodes List */}
          {hasNodes ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-3 max-h-[300px] overflow-y-auto border-t border-purple-500/30 pt-4"
            >
              <h3 className="text-sm font-semibold text-purple-300 mb-3">Node Details:</h3>
              {nodes.map((node, index) => (
                <motion.div
                  key={node.nodeId || index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex justify-between items-start bg-purple-900/20 rounded-lg px-4 py-3 border border-purple-600/30 hover:border-purple-500/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-300 mb-1">
                      Node #{node.nodeId}
                    </p>
                    <div className="space-y-1 text-xs text-gray-400">
                      <p>Epochs: {node.epochs || "N/A"}</p>
                      <p>Loss: {formatNumber(node.loss)}</p>
                      {node.timestamp && (
                        <p className="text-gray-500">Time: {formatTimestamp(node.timestamp)}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-semibold ${
                        node.accuracy > 90
                          ? "text-green-400"
                          : node.accuracy > 85
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {formatNumber(node.accuracy)}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Accuracy</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-8 text-gray-400 border-t border-purple-500/30 pt-4"
            >
              <p>⏳ Waiting for training data...</p>
            </motion.div>
          )}

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center"
          >
            <Button 
              onClick={onClose} 
              className="bg-purple-600 hover:bg-purple-500 text-white px-6"
            >
              Close
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
