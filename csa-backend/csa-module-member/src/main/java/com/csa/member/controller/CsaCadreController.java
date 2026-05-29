package com.csa.member.controller;

import com.csa.common.R;
import com.csa.member.entity.CsaCadre;
import com.csa.member.service.CsaCadreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "干部任职管理")
@RestController
@RequestMapping("/api/admin/cadres")
@RequiredArgsConstructor
public class CsaCadreController {

    private final CsaCadreService csaCadreService;

    @Operation(summary = "查询干部任职列表")
    @GetMapping
    public R<List<CsaCadre>> list(@RequestParam(required = false) Long memberId,
                                   @RequestParam(required = false) String cohort) {
        List<CsaCadre> result;
        if (memberId != null) {
            result = csaCadreService.listByMemberId(memberId);
        } else if (cohort != null && !cohort.isEmpty()) {
            result = csaCadreService.listByCohort(cohort);
        } else {
            result = csaCadreService.listByCohort(null);
        }
        return R.ok(result);
    }

    @Operation(summary = "新增干部任职记录")
    @PostMapping
    public R<Void> create(@RequestBody CsaCadre cadre) {
        boolean success = csaCadreService.save(cadre);
        if (!success) {
            return R.fail("新增失败");
        }
        return R.ok();
    }

    @Operation(summary = "更新干部任职记录")
    @PutMapping("/{id}")
    public R<Void> update(@PathVariable Long id, @RequestBody CsaCadre cadre) {
        cadre.setId(id);
        boolean success = csaCadreService.update(cadre);
        if (!success) {
            return R.fail("更新失败");
        }
        return R.ok();
    }

    @Operation(summary = "删除干部任职记录")
    @DeleteMapping("/{id}")
    public R<Void> delete(@PathVariable Long id) {
        boolean success = csaCadreService.delete(id);
        if (!success) {
            return R.fail("删除失败");
        }
        return R.ok();
    }
}
