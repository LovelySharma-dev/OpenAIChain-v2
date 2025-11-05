import express from "express";
import verifyToken from "../utils/verifyToken.js";

const router = express.Router();

// In-memory DAO governance data (could be moved to MongoDB)
let governanceData = {
  proposals: [
    {
      id: 1,
      title: "Increase Reward Pool by 50%",
      description: "Proposal to increase the total reward pool from 100,000 to 150,000 tokens to incentivize more contributors",
      proposer: "Alice Chen",
      status: "active",
      votes: { yes: 1247, no: 342 },
      quorum: 1500,
      endDate: "2025-11-15T23:59:59Z",
      category: "treasury"
    },
    {
      id: 2,
      title: "Add GPT-4 Integration",
      description: "Integrate GPT-4 API for advanced model fine-tuning capabilities",
      proposer: "Bob Smith",
      status: "active",
      votes: { yes: 892, no: 456 },
      quorum: 1500,
      endDate: "2025-11-12T23:59:59Z",
      category: "technical"
    },
    {
      id: 3,
      title: "Reduce Minimum Training Epochs",
      description: "Reduce minimum training epochs from 10 to 5 to speed up federated learning cycles",
      proposer: "Carol Davis",
      status: "pending",
      votes: { yes: 234, no: 89 },
      quorum: 1500,
      endDate: "2025-11-20T23:59:59Z",
      category: "parameters"
    },
    {
      id: 4,
      title: "Launch OpenAI Chain Governance Token",
      description: "Create a dedicated governance token (OAC-GOV) for voting rights separate from reward tokens",
      proposer: "David Wilson",
      status: "passed",
      votes: { yes: 2341, no: 567 },
      quorum: 1500,
      endDate: "2025-11-01T23:59:59Z",
      category: "governance"
    },
    {
      id: 5,
      title: "Partner with Hugging Face for Model Hosting",
      description: "Establish official partnership with Hugging Face for free model hosting for top contributors",
      proposer: "Emma Johnson",
      status: "active",
      votes: { yes: 1567, no: 234 },
      quorum: 1500,
      endDate: "2025-11-18T23:59:59Z",
      category: "partnership"
    }
  ],
  stats: {
    totalProposals: 12,
    activeProposals: 3,
    passedProposals: 4,
    rejectedProposals: 2,
    totalVoters: 3456,
    treasuryBalance: 250000
  }
};

// GET /api/governance - Get all DAO proposals
router.get("/", (req, res) => {
  try {
    console.log("🏛️  DAO Governance Data Requested");
    console.log(`📊 Active Proposals: ${governanceData.proposals.filter(p => p.status === 'active').length}`);
    
    res.json({
      success: true,
      ...governanceData,
      timestamp: new Date().toISOString()
    });

    console.log("🏛️  DAO Sync Complete");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /api/governance/:id - Get specific proposal
router.get("/:id", (req, res) => {
  try {
    const proposal = governanceData.proposals.find(
      p => p.id === parseInt(req.params.id)
    );

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found"
      });
    }

    res.json({
      success: true,
      proposal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST /api/governance/vote - Vote on a proposal
router.post("/vote", verifyToken, async (req, res) => {
  try {
    const { proposalId, vote } = req.body;

    if (!proposalId || !vote) {
      return res.status(400).json({
        success: false,
        message: "Proposal ID and vote (yes/no) are required"
      });
    }

    const proposal = governanceData.proposals.find(p => p.id === proposalId);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found"
      });
    }

    if (proposal.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: "Proposal is not active"
      });
    }

    // Record vote
    if (vote === 'yes') {
      proposal.votes.yes += 1;
    } else if (vote === 'no') {
      proposal.votes.no += 1;
    }

    console.log(`🗳️  Vote recorded for proposal ${proposalId}: ${vote}`);
    console.log(`📊 Current votes - Yes: ${proposal.votes.yes}, No: ${proposal.votes.no}`);

    res.json({
      success: true,
      message: "Vote recorded successfully",
      proposal: {
        id: proposal.id,
        title: proposal.title,
        votes: proposal.votes,
        totalVotes: proposal.votes.yes + proposal.votes.no,
        quorum: proposal.quorum
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST /api/governance/propose - Create new proposal
router.post("/propose", verifyToken, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required"
      });
    }

    const newProposal = {
      id: governanceData.proposals.length + 1,
      title,
      description,
      proposer: req.user?.name || "Anonymous",
      status: "pending",
      votes: { yes: 0, no: 0 },
      quorum: 1500,
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      category: category || "general"
    };

    governanceData.proposals.push(newProposal);
    governanceData.stats.totalProposals += 1;

    console.log(`📝 New proposal created: ${title}`);

    res.json({
      success: true,
      message: "Proposal created successfully",
      proposal: newProposal
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
