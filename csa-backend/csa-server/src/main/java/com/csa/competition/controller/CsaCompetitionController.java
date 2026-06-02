package com.csa.competition.controller;

/**
 * @author tanlja
 */

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.csa.common.R;
import com.csa.competition.entity.CsaCompetition;
import com.csa.competition.entity.CsaCompetitionAward;
import com.csa.competition.service.CsaCompetitionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/competitions")
@RequiredArgsConstructor
@Tag(name = "竞赛管理", description = "竞赛及获奖管理")
public class CsaCompetitionController {

    private final CsaCompetitionService competitionService;

    @GetMapping
    @Operation(summary = "分页查询竞赛列表")
    public R<IPage<CsaCompetition>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String compType,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword) {
        return R.ok(competitionService.listPage(page, size, level, compType, year, status, keyword));
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID查询竞赛")
    public R<CsaCompetition> getById(@PathVariable Long id) {
        CsaCompetition competition = competitionService.getById(id);
        if (competition == null) {
            return R.fail("竞赛不存在");
        }
        return R.ok(competition);
    }

    @PostMapping
    @Operation(summary = "新增竞赛")
    public R<Void> save(@RequestBody CsaCompetition competition) {
        boolean result = competitionService.save(competition);
        return result ? R.ok() : R.fail("新增失败");
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新竞赛")
    public R<Void> update(@PathVariable Long id, @RequestBody CsaCompetition competition) {
        competition.setId(id);
        boolean result = competitionService.update(competition);
        return result ? R.ok() : R.fail("更新失败");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除竞赛")
    public R<Void> delete(@PathVariable Long id) {
        boolean result = competitionService.delete(id);
        return result ? R.ok() : R.fail("删除失败");
    }

    @GetMapping("/{competitionId}/awards")
    @Operation(summary = "查询竞赛的获奖列表")
    public R<List<CsaCompetitionAward>> getAwards(@PathVariable Long competitionId) {
        return R.ok(competitionService.getAwards(competitionId));
    }

    @PostMapping("/{competitionId}/awards")
    @Operation(summary = "新增获奖记录")
    public R<Void> addAward(@PathVariable Long competitionId, @RequestBody CsaCompetitionAward award) {
        award.setCompetitionId(competitionId);
        boolean result = competitionService.addAward(award);
        return result ? R.ok() : R.fail("新增获奖失败");
    }

    @PutMapping("/{competitionId}/awards/{id}")
    @Operation(summary = "更新获奖记录")
    public R<Void> updateAward(@PathVariable Long competitionId, @PathVariable Long id, @RequestBody CsaCompetitionAward award) {
        award.setId(id);
        award.setCompetitionId(competitionId);
        boolean result = competitionService.updateAward(award);
        return result ? R.ok() : R.fail("更新获奖失败");
    }

    @DeleteMapping("/{competitionId}/awards/{id}")
    @Operation(summary = "删除获奖记录")
    public R<Void> deleteAward(@PathVariable Long competitionId, @PathVariable Long id) {
        boolean result = competitionService.deleteAward(id);
        return result ? R.ok() : R.fail("删除获奖失败");
    }
}
