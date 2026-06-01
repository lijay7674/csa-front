package com.csa.aggregate.publicapi;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.csa.common.R;
import com.csa.competition.entity.CsaCompetition;
import com.csa.competition.entity.CsaCompetitionAward;
import com.csa.competition.mapper.CsaCompetitionAwardMapper;
import com.csa.competition.mapper.CsaCompetitionMapper;
import com.csa.content.entity.CsaContent;
import com.csa.content.mapper.CsaContentMapper;
import com.csa.event.entity.CsaEvent;
import com.csa.event.mapper.CsaEventMapper;
import com.csa.member.entity.CsaMember;
import com.csa.member.mapper.CsaMemberMapper;
import com.csa.questionbank.entity.CsaQuestionBank;
import com.csa.questionbank.mapper.CsaQuestionBankMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@Tag(name = "前台公开API")
public class PublicApiController {

    private final CsaContentMapper csaContentMapper;
    private final CsaEventMapper csaEventMapper;
    private final CsaMemberMapper csaMemberMapper;
    private final CsaCompetitionMapper csaCompetitionMapper;
    private final CsaCompetitionAwardMapper csaCompetitionAwardMapper;
    private final CsaQuestionBankMapper csaQuestionBankMapper;

    // ==================== 前台公开数据封装 ====================

    private Map<String, Object> toPublicContent(CsaContent c) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", c.getId());
        m.put("title", c.getTitle());
        m.put("category", c.getCategory());
        m.put("summary", c.getSummary());
        m.put("body", c.getBody());
        m.put("coverImage", c.getCoverImage());
        m.put("source", c.getSource());
        m.put("publishedAt", c.getPublishedAt());
        return m;
    }

    private Map<String, Object> toPublicEvent(CsaEvent e) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", e.getId());
        m.put("title", e.getTitle());
        m.put("eventType", e.getEventType());
        m.put("startTime", e.getStartTime());
        m.put("endTime", e.getEndTime());
        m.put("location", e.getLocation());
        m.put("description", e.getDescription());
        m.put("summary", e.getSummary());
        return m;
    }

    private Map<String, Object> toPublicMember(CsaMember mb) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", mb.getId());
        m.put("name", mb.getName());
        m.put("cohort", mb.getCohort());
        m.put("major", mb.getMajor());
        m.put("techDirection", mb.getTechDirection());
        m.put("joinDate", mb.getJoinDate());
        m.put("displayTitle", mb.getDisplayTitle());
        m.put("displayAchievement", mb.getDisplayAchievement());
        m.put("displaySummary", mb.getDisplaySummary());
        m.put("avatarUrl", mb.getAvatarUrl());
        return m;
    }

    private Map<String, Object> toPublicAward(CsaCompetitionAward a, CsaCompetition comp) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", a.getId());
        m.put("awardLevel", a.getAwardLevel());
        m.put("memberNames", a.getMemberNames());
        m.put("advisor", a.getAdvisor());
        m.put("summary", a.getSummary());
        if (comp != null) {
            m.put("competitionName", comp.getName());
            m.put("competitionYear", comp.getYear());
            m.put("competitionLevel", comp.getLevel());
        }
        return m;
    }

    private Map<String, Object> toPublicQuestionBank(CsaQuestionBank q) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", q.getId());
        m.put("title", q.getTitle());
        m.put("year", q.getYear());
        m.put("category", q.getCategory());
        m.put("description", q.getDescription());
        return m;
    }

    // ==================== 首页聚合 ====================

    @GetMapping("/home")
    @Operation(summary = "首页聚合数据")
    public R<Map<String, Object>> home() {
        Map<String, Object> data = new HashMap<>();

        // 最新5条新闻 (category=NEWS, status=PUBLISHED)
        LambdaQueryWrapper<CsaContent> newsWrapper = new LambdaQueryWrapper<>();
        newsWrapper.eq(CsaContent::getStatus, "PUBLISHED")
                .eq(CsaContent::getCategory, "NEWS")
                .orderByDesc(CsaContent::getPublishedAt)
                .last("LIMIT 5");
        data.put("news", csaContentMapper.selectList(newsWrapper).stream()
                .map(this::toPublicContent).collect(Collectors.toList()));

        // 最新3条活动
        LambdaQueryWrapper<CsaEvent> eventWrapper = new LambdaQueryWrapper<>();
        eventWrapper.orderByDesc(CsaEvent::getCreatedAt).last("LIMIT 3");
        data.put("events", csaEventMapper.selectList(eventWrapper).stream()
                .map(this::toPublicEvent).collect(Collectors.toList()));

        // 最新3条竞赛成果 (关联竞赛表)
        LambdaQueryWrapper<CsaCompetitionAward> awardWrapper = new LambdaQueryWrapper<>();
        awardWrapper.eq(CsaCompetitionAward::getIsPublicDisplay, 1)
                .orderByDesc(CsaCompetitionAward::getCreatedAt)
                .last("LIMIT 3");
        List<CsaCompetitionAward> awards = csaCompetitionAwardMapper.selectList(awardWrapper);
        data.put("competitionResults", awards.stream().map(a -> {
            CsaCompetition comp = csaCompetitionMapper.selectById(a.getCompetitionId());
            return toPublicAward(a, comp);
        }).collect(Collectors.toList()));

        // 最新3条优秀成员 (isPublicDisplay=1)
        LambdaQueryWrapper<CsaMember> memberWrapper = new LambdaQueryWrapper<>();
        memberWrapper.eq(CsaMember::getIsPublicDisplay, 1)
                .orderByDesc(CsaMember::getCreatedAt)
                .last("LIMIT 3");
        data.put("members", csaMemberMapper.selectList(memberWrapper).stream()
                .map(this::toPublicMember).collect(Collectors.toList()));

        // 最新3条技术文章 (category=TECH, status=PUBLISHED)
        LambdaQueryWrapper<CsaContent> techWrapper = new LambdaQueryWrapper<>();
        techWrapper.eq(CsaContent::getStatus, "PUBLISHED")
                .eq(CsaContent::getCategory, "TECH")
                .orderByDesc(CsaContent::getPublishedAt)
                .last("LIMIT 3");
        data.put("techArticles", csaContentMapper.selectList(techWrapper).stream()
                .map(this::toPublicContent).collect(Collectors.toList()));

        // 最新3条题库 (isPublic=1)
        LambdaQueryWrapper<CsaQuestionBank> qbWrapper = new LambdaQueryWrapper<>();
        qbWrapper.eq(CsaQuestionBank::getIsPublic, 1)
                .orderByDesc(CsaQuestionBank::getCreatedAt)
                .last("LIMIT 3");
        data.put("questionBanks", csaQuestionBankMapper.selectList(qbWrapper).stream()
                .map(this::toPublicQuestionBank).collect(Collectors.toList()));

        return R.ok(data);
    }

    // ==================== 关于我们 ====================

    @GetMapping("/about")
    @Operation(summary = "学会简介")
    public R<Map<String, Object>> about() {
        LambdaQueryWrapper<CsaContent> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CsaContent::getCategory, "ABOUT")
                .eq(CsaContent::getStatus, "PUBLISHED")
                .last("LIMIT 1");
        CsaContent content = csaContentMapper.selectOne(wrapper);
        return R.ok(content != null ? toPublicContent(content) : null);
    }

    // ==================== 新闻 ====================

    @GetMapping("/news")
    @Operation(summary = "新闻列表")
    public R<IPage<Map<String, Object>>> news(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category) {
        LambdaQueryWrapper<CsaContent> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CsaContent::getStatus, "PUBLISHED");
        if (category == null || category.isEmpty()) {
            wrapper.eq(CsaContent::getCategory, "NEWS");
        } else {
            wrapper.eq(CsaContent::getCategory, category);
        }
        wrapper.orderByDesc(CsaContent::getPublishedAt);

        IPage<CsaContent> entityPage = csaContentMapper.selectPage(new Page<>(page, size), wrapper);
        IPage<Map<String, Object>> result = new Page<>(page, size, entityPage.getTotal());
        result.setRecords(entityPage.getRecords().stream()
                .map(this::toPublicContent).collect(Collectors.toList()));
        return R.ok(result);
    }

    @GetMapping("/news/{id}")
    @Operation(summary = "新闻详情")
    public R<Map<String, Object>> newsDetail(@PathVariable Long id) {
        CsaContent content = csaContentMapper.selectById(id);
        if (content == null || !"PUBLISHED".equals(content.getStatus())) {
            return R.fail("内容不存在");
        }
        return R.ok(toPublicContent(content));
    }

    // ==================== 公告 ====================

    @GetMapping("/notices")
    @Operation(summary = "公告列表")
    public R<IPage<Map<String, Object>>> notices(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        LambdaQueryWrapper<CsaContent> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CsaContent::getStatus, "PUBLISHED")
                .eq(CsaContent::getCategory, "NOTICE")
                .orderByDesc(CsaContent::getPublishedAt);

        IPage<CsaContent> entityPage = csaContentMapper.selectPage(new Page<>(page, size), wrapper);
        IPage<Map<String, Object>> result = new Page<>(page, size, entityPage.getTotal());
        result.setRecords(entityPage.getRecords().stream()
                .map(this::toPublicContent).collect(Collectors.toList()));
        return R.ok(result);
    }

    @GetMapping("/notices/{id}")
    @Operation(summary = "公告详情")
    public R<Map<String, Object>> noticeDetail(@PathVariable Long id) {
        CsaContent content = csaContentMapper.selectById(id);
        if (content == null || !"PUBLISHED".equals(content.getStatus())
                || !"NOTICE".equals(content.getCategory())) {
            return R.fail("公告不存在");
        }
        return R.ok(toPublicContent(content));
    }

    // ==================== 竞赛成果 ====================

    @GetMapping("/results")
    @Operation(summary = "竞赛成果列表")
    public R<IPage<Map<String, Object>>> results(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String level,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        LambdaQueryWrapper<CsaCompetitionAward> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CsaCompetitionAward::getIsPublicDisplay, 1)
                .orderByDesc(CsaCompetitionAward::getCreatedAt);

        if (year != null || level != null) {
            LambdaQueryWrapper<CsaCompetition> compWrapper = new LambdaQueryWrapper<>();
            if (year != null) compWrapper.eq(CsaCompetition::getYear, year);
            if (level != null) compWrapper.eq(CsaCompetition::getLevel, level);
            List<CsaCompetition> comps = csaCompetitionMapper.selectList(compWrapper);
            List<Long> compIds = comps.stream().map(CsaCompetition::getId).collect(Collectors.toList());
            if (compIds.isEmpty()) {
                return R.ok(new Page<>(page, size, 0));
            }
            wrapper.in(CsaCompetitionAward::getCompetitionId, compIds);
        }

        IPage<CsaCompetitionAward> entityPage = csaCompetitionAwardMapper.selectPage(new Page<>(page, size), wrapper);
        Map<Long, CsaCompetition> compMap = csaCompetitionMapper.selectList(null).stream()
                .collect(Collectors.toMap(CsaCompetition::getId, c -> c));

        IPage<Map<String, Object>> result = new Page<>(page, size, entityPage.getTotal());
        result.setRecords(entityPage.getRecords().stream()
                .map(a -> toPublicAward(a, compMap.get(a.getCompetitionId())))
                .collect(Collectors.toList()));
        return R.ok(result);
    }

    // ==================== 优秀成员 ====================

    @GetMapping("/members")
    @Operation(summary = "优秀成员列表")
    public R<IPage<Map<String, Object>>> members(
            @RequestParam(required = false) String cohort,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        LambdaQueryWrapper<CsaMember> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CsaMember::getIsPublicDisplay, 1);
        if (cohort != null && !cohort.isEmpty()) {
            wrapper.eq(CsaMember::getCohort, cohort);
        }
        wrapper.orderByDesc(CsaMember::getCreatedAt);

        IPage<CsaMember> entityPage = csaMemberMapper.selectPage(new Page<>(page, size), wrapper);
        IPage<Map<String, Object>> result = new Page<>(page, size, entityPage.getTotal());
        result.setRecords(entityPage.getRecords().stream()
                .map(this::toPublicMember).collect(Collectors.toList()));
        return R.ok(result);
    }

    // ==================== 技术文章 ====================

    @GetMapping("/tech")
    @Operation(summary = "技术文章列表")
    public R<IPage<Map<String, Object>>> tech(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        LambdaQueryWrapper<CsaContent> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CsaContent::getStatus, "PUBLISHED")
                .eq(CsaContent::getCategory, "TECH")
                .orderByDesc(CsaContent::getPublishedAt);

        IPage<CsaContent> entityPage = csaContentMapper.selectPage(new Page<>(page, size), wrapper);
        IPage<Map<String, Object>> result = new Page<>(page, size, entityPage.getTotal());
        result.setRecords(entityPage.getRecords().stream()
                .map(this::toPublicContent).collect(Collectors.toList()));
        return R.ok(result);
    }

    @GetMapping("/tech/{id}")
    @Operation(summary = "技术文章详情")
    public R<Map<String, Object>> techDetail(@PathVariable Long id) {
        CsaContent content = csaContentMapper.selectById(id);
        if (content == null || !"PUBLISHED".equals(content.getStatus())
                || !"TECH".equals(content.getCategory())) {
            return R.fail("文章不存在");
        }
        return R.ok(toPublicContent(content));
    }

    // ==================== 招新 ====================

    @GetMapping("/recruitment")
    @Operation(summary = "招新内容")
    public R<Map<String, Object>> recruitment() {
        LambdaQueryWrapper<CsaContent> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CsaContent::getCategory, "RECRUITMENT")
                .eq(CsaContent::getStatus, "PUBLISHED")
                .orderByDesc(CsaContent::getPublishedAt)
                .last("LIMIT 1");
        CsaContent content = csaContentMapper.selectOne(wrapper);
        return R.ok(content != null ? toPublicContent(content) : null);
    }
}