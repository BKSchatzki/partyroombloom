-- CreateIndex
CREATE INDEX "PRB_Sessions_userId_idx" ON "PRB_Sessions"("userId");

-- CreateIndex
CREATE INDEX "PRB_Outlines_userId_updatedAt_idx" ON "PRB_Outlines"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "PRB_Elements_outlineId_userCreatedAt_idx" ON "PRB_Elements"("outlineId", "userCreatedAt");

-- CreateIndex
CREATE INDEX "PRB_Elements_parentId_idx" ON "PRB_Elements"("parentId");

-- CreateIndex
CREATE INDEX "PRB_Elements_userId_idx" ON "PRB_Elements"("userId");

-- CreateIndex
CREATE INDEX "PRB_Conversations_outlineId_createdAt_idx" ON "PRB_Conversations"("outlineId", "createdAt");

-- CreateIndex
CREATE INDEX "PRB_Conversations_userId_idx" ON "PRB_Conversations"("userId");
