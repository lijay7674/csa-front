package com.csa.aggregate.statistics

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
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
import com.csa.registration.entity.CsaRegistration;
import com.csa.registration.mapper.CsaRegistrationMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/statistics")
@RequiredArgsConstructor
@Tag(name = "统计查询")
public class StatisticsController {

    private final CsaMemberMapper csaMemberMapper;
    private final CsaContentMapper csaContentMapper;
    private final CsaRegistrationMapper csaRegistrationMapper;
    private final CsaEventMapper csaEventMapper;
    private final CsaCompetitionMapper csaCompetitionMapper;
    private final CsaCompetitionAwardMapper csaCompetitionAwardMapper;

    @GetMapping("/overview")
    @Operation(summary = "概览统计")
    public R<Map<String, Object>> overview() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalMembers", csaMemberMapper.selectCount(null));
        stats.put("totalEvents", csaEventMapper.selectCount(null));
        stats.put("totalCompetitions", csaCompetitionMapper.selectCount(null));
        stats.put("totalRegistrations", csaRegistrationMapper.selectCount(null));
        stats.put("totalContents", csaContentMapper.selectCount(null));

        // 待审核数：registration + content 中状态为 PENDING_REVIEW
        LambdaQueryWrapper<CsaRegistration> regPendingWrapper = new LambdaQueryWrapper<>();
        regPendingWrapper.eq(CsaRegistration::getStatus, "PENDING_REVIEW");
        long pendingRegistrations = csaRegistrationMapper.selectCount(regPendingWrapper);

        LambdaQueryWrapper<CsaContent> contentPendingWrapper = new LambdaQueryWrapper<>();
        contentPendingWrapper.eq(CsaContent::getStatus, "PENDING_REVIEW");
        long pendingContents = csaContentMapper.selectCount(contentPendingWrapper);

        stats.put("pendingReviews", pendingRegistrations + pendingContents);

        return R.ok(stats);
    }

    @GetMapping("/by-cohort")
    @Operation(summary = "按届别统计成�?)
    public R<Map<String, Long>> byCohort() {
        List<CsaMember> members = csaMemberMapper.selectList(null);
        Map<String, Long> result = members.stream()
                .filter(m -> m.getCohort() != null)
                .collect(Collectors.groupingBy(CsaMember::getCohort, Collectors.counting()));
        return R.ok(result);
    }

    @GetMapping("/by-competition")
    @Operation(summary = "按竞赛等级统计获�?)
    public R<Map<String, Long>> byCompetition() {
        // TODO: 可扩展为关联竞赛表获取等级信�?        List<CsaCompetition> competitions = csaCompetitionMapper.selectList(null);
        Map<String, Long> result = competitions.stream()
                .filter(c -> c.getLevel() != null)
                .collect(Collectors.groupingBy(CsaCompetition::getLevel, Collectors.counting()));
        return R.ok(result);
    }

    @GetMapping("/by-event-type")
    @Operation(summary = "按活动类型统�?)
    public R<Map<String, Long>> byEventType() {
        List<CsaEvent> events = csaEventMapper.selectList(null);
        Map<String, Long> result = events.stream()
                .filter(e -> e.getEventType() != null)
                .collect(Collectors.groupingBy(CsaEvent::getEventType, Collectors.counting()));
        return R.ok(result);
    }
}
