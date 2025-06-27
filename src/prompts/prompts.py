BRAIN_STORM_SYSTEM_PROMPT = """<meeting_transcript_extractor>
  <role>
    You are a specialized assistant designed to analyze meeting transcripts
    and extract actionable tasks and ideas.
  </role>
  <instructions>
    <step>Read the entire transcript carefully to understand the context and flow of the meeting</step>
    <step>Extract all tasks and action items mentioned during the discussion</step>
    <step>Identify ideas, suggestions, and proposals that were discussed</step>
    <step>Present the information in clear, organized lists</step>
  </instructions>
  <output_format>
    <tasks_and_action_items>
      - [Task description] - <assigned_to>[Person's name if mentioned]</assigned_to> - <due_date>[If specified]</due_date>
    </tasks_and_action_items>
    <ideas_and_suggestions>
      - [Idea or suggestion description]
    </ideas_and_suggestions>
  </output_format>
  <guidelines>
    <note>Be comprehensive; don't miss any items</note>
    <note>Use clear language; rephrase for clarity</note>
    <note>Ignore small talk; focus on work-related content</note>
  </guidelines>
</meeting_transcript_extractor>"""


transcript1 = """
ClearCaptions – Internal Stakeholder Meeting Transcript
Topic: Improving user experience for older adults using phone captioning services.
Participants:
Sam (Product Manager)
Leah (UX Lead)
Raj (Engineering Manager)
Kelly (Customer Support Lead)
Ana (Marketing Lead)

Sam: Thanks everyone. I wanted to kick off with some trends we're seeing. Our NPS is dipping for users over 65, especially on the mobile app. The biggest complaints? Confusing interface and slow caption speed.
Kelly: Support is hearing the same. We've had 42 tickets this month just about laggy captions. One woman said it was like "watching a movie with out-of-sync subtitles." We also get a lot of "Where do I even start?" with onboarding.
Leah: We watched 5 user sessions last week. Most people tried to tap multiple buttons at once, or missed the captions entirely because the text was too small or the screen was cluttered. One tester literally said, "I just want a green button that says 'Call my doctor' — that's all I need."
Ana: That tracks with our survey data. Simplicity and confidence are top emotional drivers for our users. They don't want to feel dumb or left behind. They want control, especially during stressful calls like with doctors or insurance.
Raj: On the backend, we can probably improve caption speed, but UI design plays a big role in perceived speed too. If people are staring at a wall of text, it feels slower even if it's technically fast.
Sam: So we're talking: reduce cognitive load, speed up perceived responsiveness, and make onboarding "friendlier"?
Leah: Exactly. We need to reframe the whole experience as empowering, not overwhelming.
"""