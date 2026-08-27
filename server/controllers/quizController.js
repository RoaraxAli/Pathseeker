import { QuizQuestion } from '../models/QuizQuestion.js';
import { QuizAttempt } from '../models/QuizAttempt.js';
import { Career } from '../models/Career.js';

// @desc   Get all quiz questions
// @route  GET /api/quiz/questions
export const getQuizQuestions = async (req, res) => {
  try {
    const questions = await QuizQuestion.find({}).sort({ order: 1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch quiz questions' });
  }
};

// @desc   Submit quiz answers and calculate career matches
// @route  POST /api/quiz/submit
export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // Array of selected option objects with traitScores or answers map

    let aggregatedScores = {
      tech: 0,
      data: 0,
      creative: 0,
      leadership: 0,
      healthcare: 0,
      cybersecurity: 0,
    };

    if (Array.isArray(answers)) {
      answers.forEach((ans) => {
        if (ans && ans.traitScores) {
          Object.keys(ans.traitScores).forEach((trait) => {
            if (aggregatedScores[trait] !== undefined) {
              aggregatedScores[trait] += Number(ans.traitScores[trait]) || 0;
            }
          });
        }
      });
    }

    // Determine primary matching domain
    let maxTrait = 'tech';
    let maxScore = -1;
    Object.entries(aggregatedScores).forEach(([trait, score]) => {
      if (score > maxScore) {
        maxScore = score;
        maxTrait = trait;
      }
    });

    const traitToDomain = {
      tech: 'Software & Cloud',
      data: 'AI & Data Science',
      creative: 'Design & UX',
      leadership: 'Product & Strategy',
      healthcare: 'Healthcare & Biotech',
      cybersecurity: 'Cybersecurity',
    };

    const primaryDomain = traitToDomain[maxTrait] || 'Software & Cloud';

    // Fetch matching careers from DB
    const matchingCareers = await Career.find({
      $or: [{ domain: primaryDomain }, { isTrending: true }],
    }).limit(4);

    const recommendedCareers = matchingCareers.map((c, idx) => {
      const matchPct = Math.max(78, 98 - idx * 6);
      return {
        title: c.title,
        domain: c.domain,
        matchPercentage: matchPct,
        slug: c.slug,
        salary: c.salaryRange?.senior || 150000,
        demand: c.jobDemand || 'High',
      };
    });

    // Save attempt if user is authenticated
    let attempt = null;
    if (req.user) {
      attempt = await QuizAttempt.create({
        userId: req.user._id,
        scores: aggregatedScores,
        primaryDomain,
        recommendedCareers: recommendedCareers.map((r) => ({
          title: r.title,
          matchPercentage: r.matchPercentage,
          domain: r.domain,
        })),
        answersCount: Array.isArray(answers) ? answers.length : 0,
      });
    }

    res.json({
      scores: aggregatedScores,
      primaryDomain,
      recommendedCareers,
      attemptId: attempt ? attempt._id : null,
      message: 'Assessment completed successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to submit quiz assessment' });
  }
};

// @desc   Get user quiz attempt history
// @route  GET /api/quiz/history
export const getQuizHistory = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch quiz history' });
  }
};

// @desc   Create quiz question (Admin)
// @route  POST /api/quiz/questions
export const createQuizQuestion = async (req, res) => {
  try {
    const { questionText, category, type, options, timeLimitSec, order } = req.body;
    const newQuestion = await QuizQuestion.create({
      questionText,
      category: category || 'General Assessment',
      type: type || 'multiple_choice',
      options: options || [],
      timeLimitSec: timeLimitSec || 45,
      order: order || 1,
    });
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create quiz question' });
  }
};

// @desc   Update quiz question (Admin)
// @route  PUT /api/quiz/questions/:id
export const updateQuizQuestion = async (req, res) => {
  try {
    const question = await QuizQuestion.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Quiz question not found' });
    }
    Object.assign(question, req.body);
    const updated = await question.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update question' });
  }
};

// @desc   Delete quiz question (Admin)
// @route  DELETE /api/quiz/questions/:id
export const deleteQuizQuestion = async (req, res) => {
  try {
    const question = await QuizQuestion.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Quiz question not found' });
    }
    res.json({ message: 'Quiz question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete question' });
  }
};
