const ProductComment = require('../models/ProductComment.model');

/**
 * Add Product Comment
 */
exports.addComment = async (req, res) => {
  try {
    const { productId, comment } = req.body;

    const data = await ProductComment.create({
      productId,
      userId: req.user.id,
      comment
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Reply to Comment
 */
exports.replyComment = async (req, res) => {
  try {
    const { productId, parentCommentId, comment } = req.body;

    const parentExists = await ProductComment.findById(parentCommentId);
    if (!parentExists) {
      return res.status(404).json({
        success: false,
        message: 'Parent comment not found'
      });
    }

    const data = await ProductComment.create({
      productId,
      userId: req.user.id,
      parentCommentId,
      comment
    });

    res.status(201).json({
      success: true,
      message: 'Reply added successfully',
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get Product Comments with Replies
 */
exports.getProductComments = async (req, res) => {
  try {
    const { productId } = req.params;
    const maxDepth = Math.max(1, parseInt(req.query.maxDepth, 10) || 5); // optional ?maxDepth= to limit recursion

    // recursive helper to fetch replies up to maxDepth
    const fetchReplies = async (parentId, depth = 0) => {
      if (depth >= maxDepth) return [];
      const replies = await ProductComment.find({ parentCommentId: parentId })
        .populate('userId', 'name email')
        .sort({ createdAt: 1 })
        .lean();
      for (let r of replies) {
        r.replies = await fetchReplies(r._id, depth + 1);
      }
      return replies;
    };

    const comments = await ProductComment.find({
      productId,
      parentCommentId: null
    })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    for (let comment of comments) {
      comment.replies = await fetchReplies(comment._id);
    }

    res.json({
      success: true,
      data: comments,
      message: 'Comments fetched successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Delete Comment (Owner Only)
 */
exports.deleteComment = async (req, res) => {
  try {
    const comment = await ProductComment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    await ProductComment.deleteMany({
      $or: [
        { _id: comment._id },
        { parentCommentId: comment._id }
      ]
    });

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
