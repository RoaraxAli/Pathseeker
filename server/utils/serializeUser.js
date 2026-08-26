// Shapes a User document into what's safe to send to the client —
// never includes password or resetOTP fields even if they were selected.
function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    education: user.education || [],
    skills: user.skills || [],
    interests: user.interests || [],
    workExperience: user.workExperience || [],
    resume: user.resume?.filename
      ? {
          originalName: user.resume.originalName,
          mimeType: user.resume.mimeType,
          size: user.resume.size,
          uploadedAt: user.resume.uploadedAt,
        }
      : null,
    createdAt: user.createdAt,
  };
}

module.exports = serializeUser;
